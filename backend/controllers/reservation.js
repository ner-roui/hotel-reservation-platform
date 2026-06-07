const Reservation = require("../models/ReservationModel");
const RoomModel = require("../models/RoomModels");
const UserModel = require("../models/UserModel");
const PDFDocument = require("pdfkit");
/**
 * CREATE RESERVATION
 */

const createReservation = async (req, res) => {
  try {
 
    const { userId } = req.user;
    const { roomId } = req.params;
    const { arrivee, depart, prixParNuit } = req.body;
    console.log('rrrrrr', roomId)
    const room = await RoomModel.findById(roomId);

   
    
    const start = new Date(arrivee);
    const end = new Date(depart);

    const isReserved = await Reservation.findOne({
      user: userId,
      chambre: roomId,
      status: { $ne: "CANCELLED" },
      arrivee: { $lt: end },  //  $lt mean less than
      depart: { $gt: start }, // $gt mean greater than
    });

    if (isReserved) {
      return res.status(400).json({
        message: "Vous avez déjà réservé cette chambre pour ces dates",
      });
    }

    // 1. CHECK OVERLAP DANS ARRAY
    const isOverlap = room.reservation_active?.some((r) => {
      const checkin = new Date(r.date_checkin);
      const checkout = new Date(r.date_checkout);
      const payment = r.paymentStatus;

      return start < checkout && end > checkin && payment === "PAID";
    });

    if (isOverlap) {
      return res.status(400).json({
        message: "Chambre déjà réservée pour cette période",
      });
    }

    // 2. calcul nuits
    const nuits = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (nuits <= 0) {
      return res.status(400).json({
        message: "Dates invalides",
      });
    }

    const total = nuits * prixParNuit;

    // 3. create reservation
    const reservation = await Reservation.create({
       user: userId,
      chambre: roomId,
      arrivee: start,
      depart: end,
      nuits,
      prixParNuit,
      total,
      status: "PENDING",
      paymentStatus: "UNPAID",
    });

    // 4. push dans room array
  await RoomModel.findByIdAndUpdate(roomId, {
    $push: {
      reservation_active: {
        reservation_id: reservation._id,
        date_checkin: start,
        date_checkout: end,
        montant: total
      }
    }
  });

  // 5. push reservation dans user
  await UserModel.findByIdAndUpdate(userId, {
    $push: {
      reservations: reservation._id
    }
});
    return res.status(201).json({
      message: "Réservation créée avec succès",
      reservation,
    });

  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
      
    });
  }
};


const checkInReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({
        message: "Réservation introuvable",
      });
    }

    // Vérifier état actuel
    if (reservation.status === "CHECKIN") {
      return res.status(400).json({
        message: "Déjà en check-in",
      });
    }

    if (reservation.status === "CANCELLED") {
      return res.status(400).json({
        message: "Réservation annulée",
      });
    }

    const chambre = await RoomModel.findById(reservation.chambre._id);

    if (!chambre) {
      return res.status(404).json({
        message: "Chambre introuvable",
      });
    }

    const now = new Date();

    // 1. update reservation
    reservation.status = "CHECKIN";
    // reservation.date_checkout = now;

    // Si paiement en espèces => marqué comme payé au check-in
      if (reservation.paymentMethod === "Espèces") {
        reservation.paymentStatus = "PAID";
      }
    // 2. update chambre status
    chambre.statut = "Occupée";

    // 3. update reservation_active array
    chambre.reservation_active = chambre.reservation_active.map((r) => {
      if (r.reservation_id.toString() === reservation._id.toString()) {
        return {
          ...r,
          status: "CHECKIN",
          date_checkin: now
        };
      }
      return r;
    });

    await chambre.save();
    await reservation.save();



    res.status(200).json({
      message: "Check-in effectué avec succès",
      reservation,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};


const checkOutReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id);


    if (!reservation) {
      return res.status(404).json({
        message: "Réservation introuvable",
      });
    }

    if (reservation.status === "CHECKOUT") {
      return res.status(400).json({
        message: "Déjà en check-out",
      });
    }

    if (reservation.status === "CANCELLED") {
      return res.status(400).json({
        message: "Réservation annulée",
      });
    }
    
  const chambre = await RoomModel.findById(reservation.chambre._id);

    if (!chambre) {
      return res.status(404).json({
        message: "Chambre introuvable",
      });
    }

    const now = new Date();

    // 1. update reservation
    reservation.status = "CHECKOUT";
    // reservation.date_checkout = now;

    // 2. update chambre status
    chambre.statut = "À nettoyer";

    // 3. update reservation_active array
    chambre.reservation_active = chambre.reservation_active.map((r) => {
      if (r.reservation_id.toString() === reservation._id.toString()) {
        return {
          ...r,
          status: "CHECKOUT",
          date_checkout: now,
        };
      }
      return r;
    });

    await chambre.save();
    await reservation.save();


    res.status(200).json({
      message: "Check-out effectué avec succès",
      reservation,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};




const cancelReservation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({ message: "Réservation introuvable" });
    }
    console.log('user===>', reservation.user ,  userId)

    if (reservation.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Non autorisé alm3alm" });
    }

    if (reservation.status === "CANCELLED") {
      return res.status(400).json({ message: "Déjà annulée" });
    }

    if (reservation.status === "COMPLETED") {
      return res.status(400).json({ message: "Réservation terminée, impossible d'annuler" });
    }

    // 1. update reservation principale
    reservation.status = "CANCELLED";
    reservation.cancelledAt = new Date();
    reservation.cancelledBy = userId;

    await reservation.save();

    // 2. update reservationActive (snapshot chambre)
    await RoomModel.updateOne(
      { "reservation_active.reservation_id": reservation._id },
      {
        $set: {
          "reservation_active.$.status": "CANCELLED",
          "reservation_active.$.cancelledAt": reservation.cancelledAt,
          "reservation_active.$.cancelledBy": userId,
        },
      }
    );

    return res.status(200).json({
      message: "Réservation annulée avec succès",
      reservation,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};


const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("user", "-password")
      .populate("chambre");

    res.status(200).json({
      message: "Liste des réservations",
      reservations,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

const getReservationsAnnule = async (req, res) => {
  try {
    const reservations = await Reservation.find({status : "CANCELLED"})
      .populate("user", "-password")
      .populate("chambre");

    res.status(200).json({
      message: "Liste des réservations",
      reservations,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

const getUserReservations = async (req, res) => {
  try {
    const { userId } = req.user;

    const reservations = await Reservation.find({ user: userId })
    .populate("user", "prenom name email")
      .populate("chambre")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Réservations utilisateur",
      reservations,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id)
      .populate("user", "-password")
      .populate("chambre");

    if (!reservation) {
      return res.status(404).json({
        message: "Réservation introuvable",
      });
    }

    res.status(200).json({
      reservation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};


const getMonthlyRevenue = async (req, res) => {
  try {
    const reservations = await Reservation.find({
      paymentStatus: "PAID",
    });

    const months = [
      "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
      "Juil", "Août", "Sep", "Oct", "Nov", "Déc"
    ];

    const revenueData = months.map((month) => ({
      month,
      value: 0,
    }));

    reservations.forEach((reservation) => {
      const date = new Date(reservation.arrivee);

      const monthIndex = date.getMonth();

      revenueData[monthIndex].value += reservation.total || 0;
    });

    res.json({
      success: true,
      revenueData,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

/**
 * UPDATE RESERVATION
 */
const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const { arrivee, depart, prixParNuit, chambre, voyageurs} = req.body;

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({
        message: "Réservation introuvable",
      });
    }

    // recalcul dates si modifiées
    let start = reservation.arrivee;
    let end = reservation.depart;

    if (arrivee) start = new Date(arrivee);
    if (depart) end = new Date(depart);

    const nuits = Math.ceil(
      (end - start) / (1000 * 60 * 60 * 24)
    );

    if (nuits <= 0) {
      return res.status(400).json({
        message: "Dates invalides",
      });
    }

    const price = prixParNuit || reservation.prixParNuit;
    const total = nuits * price;

    reservation.arrivee = start;
    reservation.depart = end;
    reservation.nuits = nuits;
    reservation.chambre = chambre;
    reservation.prixParNuit = price;
    reservation.total = total;

    await reservation.save();

    res.status(200).json({
      message: "Réservation mise à jour",
      reservation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};


/**
 * DELETE RESERVATION
 */

const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({
        message: "Réservation introuvable",
      });
    }

    await Reservation.findByIdAndDelete(id);

    res.status(200).json({
      message: "Réservation supprimée avec succès",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};




const downloadInvoice = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate("user",   "prenom name email")
      .populate("chambre","type numero etage superficie vue prix_nuit");

    if (!reservation)
      return res.status(404).json({ message: "Réservation introuvable" });

    if (reservation.paymentStatus !== "PAID")
      return res.status(403).json({ message: "Paiement non effectué" });

    const invoiceNum = `FAC-${reservation._id.toString().slice(-6).toUpperCase()}`;
    const nights     = reservation.nuits || Math.ceil(
      (new Date(reservation.depart) - new Date(reservation.arrivee)) / (1000 * 60 * 60 * 24)
    );
    const totalTTC = reservation.total;

    const formatDate = (d) =>
      new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

    // ── PDF ──────────────────────────────────────────────────────────
    // autoFirstPage:false + layout fixe pour garantir UNE seule page
    const doc = new PDFDocument({
      size: "A4",
      margin: 0,
      autoFirstPage: false,
      bufferPages: true,
    });

    doc.addPage({ size: "A4", margin: 0 });

    res.setHeader("Content-Disposition", `attachment; filename=facture-${invoiceNum}.pdf`);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
    doc.pipe(res);

    const ML   = 50;               // margin left
    const MR   = 50;               // margin right
    const W    = 595 - ML - MR;    // A4 width = 595pt
    // couleurs
    const WARM  = "#7c5a38";
    const LIGHT = "#a8968a";
    const DARK  = "#2c1a0e";

    let y = 0; // curseur vertical manuel — on ne laisse jamais PDFKit décider

    // ── Header band ──────────────────────────────────────────────────
    doc.rect(0, y, 595, 75).fill("#3d2614");

    doc.fillColor("#fff").font("Helvetica-Bold").fontSize(20)
       .text("LUMIÈRE HOTELS", ML, 18, { lineBreak: false });
    doc.fillColor("#c4a882").font("Helvetica").fontSize(9)
       .text("L'excellence à chaque séjour", ML, 42, { lineBreak: false });

    doc.fillColor("#fff").font("Helvetica-Bold").fontSize(24)
       .text("FACTURE", 0, 16, { align: "right", width: 595 - MR, lineBreak: false });
    doc.fillColor("#c4a882").font("Helvetica").fontSize(9)
       .text(invoiceNum, 0, 44, { align: "right", width: 595 - MR, lineBreak: false });

    y = 75;

    // ── Thin accent line ─────────────────────────────────────────────
    doc.rect(0, y, 595, 3)
       .fillOpacity(1)
       .fill("#a07850");
    y += 3;

    // ── Meta row ─────────────────────────────────────────────────────
    y += 12;
    doc.fillColor(LIGHT).font("Helvetica").fontSize(9)
       .text(`Émise le : ${formatDate(new Date())}`, ML, y, { lineBreak: false });
    doc.fillColor(LIGHT).font("Helvetica").fontSize(9)
       .text(`Méthode : ${reservation.paymentMethod || "Carte bancaire"}`, ML, y + 14, { lineBreak: false });

    // Paid badge
    doc.roundedRect(595 - MR - 82, y + 2, 82, 18, 9).fill("#dcfce7");
    doc.fillColor("#15803d").font("Helvetica-Bold").fontSize(8)
       .text("✓  PAYÉE", 595 - MR - 82, y + 7, { width: 82, align: "center", lineBreak: false });

    y += 42;

    // ── Client + Chambre boxes ────────────────────────────────────────
    const boxH = 62;
    const halfW = (W - 10) / 2;

    // Client box
    doc.rect(ML, y, halfW, boxH).fill("#faf7f4");
    doc.rect(ML, y, halfW, boxH).stroke("#ede5db");
    doc.fillColor(LIGHT).font("Helvetica-Bold").fontSize(7)
       .text("FACTURÉ À", ML + 10, y + 8, { lineBreak: false });
    doc.fillColor(DARK).font("Helvetica-Bold").fontSize(11)
       .text(`${reservation.user?.prenom || ""} ${reservation.user?.name || ""}`, ML + 10, y + 20, { lineBreak: false });
    doc.fillColor(LIGHT).font("Helvetica").fontSize(8)
       .text(reservation.user?.email || "", ML + 10, y + 36, { lineBreak: false });

    // Chambre box
    const bx2 = ML + halfW + 10;
    doc.rect(bx2, y, halfW, boxH).fill("#faf7f4");
    doc.rect(bx2, y, halfW, boxH).stroke("#ede5db");
    doc.fillColor(LIGHT).font("Helvetica-Bold").fontSize(7)
       .text("CHAMBRE", bx2 + 10, y + 8, { lineBreak: false });
    doc.fillColor(DARK).font("Helvetica-Bold").fontSize(11)
       .text(`${reservation.chambre?.type} — Ch. ${reservation.chambre?.numero}`, bx2 + 10, y + 20, { lineBreak: false });
    doc.fillColor(LIGHT).font("Helvetica").fontSize(8)
       .text(`Étage ${reservation.chambre?.etage}  ·  ${reservation.chambre?.superficie} m²`, bx2 + 10, y + 36, { lineBreak: false });

    y += boxH + 12;

    // ── Dates row ────────────────────────────────────────────────────
    const dW  = (W - 16) / 3;
    const dH  = 42;

    [
      { label: "ARRIVÉE",  val: formatDate(reservation.arrivee) },
      { label: "DÉPART",   val: formatDate(reservation.depart)  },
      { label: "DURÉE",    val: `${nights} nuit${nights > 1 ? "s" : ""}` },
    ].forEach((item, i) => {
      const dx = ML + i * (dW + 8);
      doc.rect(dx, y, dW, dH).fill("#faf7f4");
      doc.rect(dx, y, dW, dH).stroke("#ede5db");
      doc.fillColor(LIGHT).font("Helvetica-Bold").fontSize(7)
         .text(item.label, dx, y + 7, { width: dW, align: "center", lineBreak: false });
      doc.fillColor(DARK).font("Helvetica-Bold").fontSize(10)
         .text(item.val, dx, y + 20, { width: dW, align: "center", lineBreak: false });
    });

    y += dH + 16;

    // ── Table header ─────────────────────────────────────────────────
    doc.rect(ML, y, W, 22).fill("#3d2614");

    const cols = [
      { label: "DESCRIPTION",   x: ML + 10,      w: 200 },
      { label: "QUANTITÉ",      x: ML + 218,     w: 80,  align: "center" },
      { label: "PRIX / NUIT",   x: ML + 306,     w: 90,  align: "right"  },
      { label: "TOTAL",         x: ML + 400,     w: 90,  align: "right"  },
    ];

    cols.forEach(c => {
      doc.fillColor("#c4a882").font("Helvetica-Bold").fontSize(7.5)
         .text(c.label, c.x, y + 7, { width: c.w, align: c.align || "left", lineBreak: false });
    });

    y += 22;

    // ── Table row ────────────────────────────────────────────────────
    const rowH = 50;
    doc.rect(ML, y, W, rowH).fill("#fdfbf8");
    doc.rect(ML, y, W, rowH).stroke("#ede5db");

    doc.fillColor(DARK).font("Helvetica-Bold").fontSize(10)
       .text(`${reservation.chambre?.type} — Chambre ${reservation.chambre?.numero}`, ML + 10, y + 8, { width: 200, lineBreak: false });
    doc.fillColor(LIGHT).font("Helvetica").fontSize(8)
       .text(`${formatDate(reservation.arrivee)} → ${formatDate(reservation.depart)}`, ML + 10, y + 24, { width: 200, lineBreak: false });

    doc.fillColor(DARK).font("Helvetica").fontSize(10)
       .text(`${nights} nuit${nights > 1 ? "s" : ""}`, ML + 218, y + 18, { width: 80, align: "center", lineBreak: false });
    doc.fillColor(DARK).font("Helvetica").fontSize(10)
       .text(`€${(reservation.prixParNuit || reservation.chambre?.prix_nuit || 0).toLocaleString("fr-FR")}`,
             ML + 306, y + 18, { width: 90, align: "right", lineBreak: false });
    doc.fillColor(DARK).font("Helvetica-Bold").fontSize(13)
       .text(`€${totalTTC?.toLocaleString("fr-FR")}`, ML + 400, y + 16, { width: 90, align: "right", lineBreak: false });

    y += rowH + 14;

    // ── Total block (simple, sans TVA) ───────────────────────────────
    const totW = 210;
    const totX = ML + W - totW;

    doc.rect(totX, y, totW, 32).fill("#3d2614");
    doc.fillColor("#e7d8c7").font("Helvetica-Bold").fontSize(11)
       .text("TOTAL", totX + 12, y + 10, { width: totW / 2, lineBreak: false });
    doc.fillColor("#fff").font("Helvetica-Bold").fontSize(15)
       .text(`€${totalTTC?.toLocaleString("fr-FR")}`, totX, y + 8, { width: totW - 12, align: "right", lineBreak: false });

    y += 32 + 10;

    // ── Payment method ───────────────────────────────────────────────
    doc.fillColor(LIGHT).font("Helvetica").fontSize(8.5)
       .text(`Payé par : `, totX, y, { continued: true, lineBreak: false })
       .fillColor(WARM).font("Helvetica-Bold")
       .text(reservation.paymentMethod || "Carte bancaire", { lineBreak: false });

    // ── Footer (position absolue en bas de page) ──────────────────────
    // On le place en absolu pour ne PAS dépendre du curseur y courant
    const footY = 842 - 55;
    doc.rect(ML, footY - 8, W, 0.5).fill("#ede5db");

    doc.fillColor(LIGHT).font("Helvetica").fontSize(7.5)
       .text(
         "Lumière Hotels SAS  ·  SIRET 123 456 789 00012",
         ML, footY, { width: W, align: "center", lineBreak: false }
       );
    doc.fillColor(LIGHT).font("Helvetica").fontSize(7.5)
       .text(
         "12 Avenue des Lumières, Paris 75008  ·  contact@lumiere-hotels.fr",
         ML, footY + 13, { width: W, align: "center", lineBreak: false }
       );
    doc.fillColor(LIGHT).font("Helvetica").fontSize(7.5)
       .text(
         "Merci pour votre confiance et à bientôt chez Lumière Hotels 🙏",
         ML, footY + 26, { width: W, align: "center", lineBreak: false }
       );

    doc.end();

  } catch (err) {
    console.error(err);
    if (!res.headersSent) res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createReservation,
  checkInReservation,
  getAllReservations,
  getUserReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
  cancelReservation,
  checkOutReservation,
  getReservationsAnnule,
  getMonthlyRevenue,
  downloadInvoice,
};


