/**
 * Notification service — maps disaster categories to responsible government institutions.
 * Currently logs notifications; ready for email/API integration.
 */

const INSTITUTION_MAP = {
  rupa: {
    naziv: 'Komunalno preduzeće / Direkcija za ceste',
    email: null, // Add real email when available
    opis: 'Nadležni za održavanje cestovne infrastrukture'
  },
  pozar: {
    naziv: 'Vatrogasna brigada / MUP',
    email: null,
    opis: 'Nadležni za gašenje požara i spašavanje'
  },
  poplava: {
    naziv: 'Civilna zaštita',
    email: null,
    opis: 'Nadležni za zaštitu od poplava i prirodnih katastrofa'
  },
  zemljotres: {
    naziv: 'Civilna zaštita / Seizmološki zavod',
    email: null,
    opis: 'Nadležni za seizmološku aktivnost i posljedice zemljotresa'
  },
  kliziste: {
    naziv: 'Civilna zaštita / Geološki zavod',
    email: null,
    opis: 'Nadležni za geološke hazarde i klizišta'
  },
  infrastruktura: {
    naziv: 'Komunalno preduzeće / Općina',
    email: null,
    opis: 'Nadležni za komunalnu infrastrukturu'
  }
};

/**
 * Returns the institution info for a given category
 */
function getInstitution(kategorija) {
  return INSTITUTION_MAP[kategorija] || null;
}

/**
 * Notifies the responsible institution about a new report.
 * Currently logs to console — replace with email/API call when ready.
 */
async function notifyInstitution(report) {
  const institution = INSTITUTION_MAP[report.kategorija];
  if (!institution) {
    console.warn(`[NOTIFY] Nepoznata kategorija: ${report.kategorija}`);
    return;
  }

  console.log(`[NOTIFY] Nova prijava #${report.id}`);
  console.log(`  Kategorija: ${report.kategorija}`);
  console.log(`  Institucija: ${institution.naziv}`);
  console.log(`  Lokacija: ${report.latitude}, ${report.longitude}`);
  console.log(`  Prioritet: ${report.prioritet}`);

  if (institution.email) {
    // TODO: Implement actual email sending
    // await sendEmail({
    //   to: institution.email,
    //   subject: `Nova prijava: ${report.kategorija} - ${report.prioritet}`,
    //   body: `Opis: ${report.opis}\nLokacija: ${report.latitude}, ${report.longitude}`
    // });
    console.log(`  Email bi bio poslan na: ${institution.email}`);
  } else {
    console.log(`  Email nije konfigurisan za ovu instituciju.`);
  }
}

module.exports = { getInstitution, notifyInstitution, INSTITUTION_MAP };
