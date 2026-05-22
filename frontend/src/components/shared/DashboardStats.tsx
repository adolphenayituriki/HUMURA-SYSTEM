export function getDashboardStats() {
  return {
    totalBeneficiaries: { label: 'Total Beneficiaries', value: '1,248', change: '+12%', up: true, icon: '👥' },
    screeningsDone: { label: 'Screenings This Month', value: '342', change: '+8%', up: true, icon: '🩺' },
    activeGroups: { label: 'Active Healing Groups', value: '87', change: '+4%', up: true, icon: '🤝' },
    youthPrograms: { label: 'Youth Programs', value: '24', change: '+6%', up: true, icon: '🎓' },
    treatmentComplete: { label: 'Recovery Rate', value: '68%', change: '+5%', up: true, icon: '🌿' },
    emergencyCases: { label: 'Pending Emergencies', value: '7', change: '-18%', up: true, icon: '🚨' },
  };
}
