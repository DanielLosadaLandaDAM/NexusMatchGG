const gameLimits = {
  'lol': 4, 'cs2': 4, 'valorant': 4, 'fortnite': 3, 'rocket-league': 2,
  'overwatch': 4, 'minecraft': 7, 'warzone': 3, 'apex': 2, 'marvel-rivals': 4,
  'gta-v': 7, 'dota-2': 4, 'pubg': 3, 'rust': 7, 'wow': 7
};

export const getSmartMatches = (currentUser, allUsers, gameSlug) => {
  // 1. FILTRO OBLIGATORIO: Mismo juego y no soy yo mismo
  let candidates = allUsers.filter(u => 
    u.id !== currentUser.id && 
    u.games.includes(gameSlug)
  );

  if (candidates.length === 0) return null;

  // 2. CÁLCULO DE AFINIDAD (Pesos 2026)
  const scored = candidates.map(player => {
    let affinity = 0;

    // Prioridad 2: Idiomas (¿Comparten al menos uno?)
    const commonLanguages = player.languages.filter(lang => currentUser.languages.includes(lang));
    if (commonLanguages.length > 0) affinity += 0.5;

    // Prioridad 3: Estilo (Casual/Comp)
    if (player.style === currentUser.style) affinity += 0.3;

    // Prioridad 4: País
    if (player.country === currentUser.country) affinity += 0.2;

    return { 
      ...player, 
      matchPercentage: Math.round(affinity * 100) 
    };
  });

  // 3. ORDENAR Y APLICAR LIMITES
  return scored
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
    .slice(0, gameLimits[gameSlug] || 5);
};