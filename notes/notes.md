1. Refactoring della pagina Home
Abbiamo completamente ripulito Home.tsx, riducendolo da ~200 righe a circa 40.

Rimossa logica duplicata, useEffect, useMemo e fetch manuali.

Migliorata la leggibilità e la struttura generale del componente.

 2. Introduzione di React Query
Sostituita la fetch manuale con useQuery.

Implementato caching, deduping e gestione automatica di loading/error.

Codice più performante e più vicino agli standard moderni.

 3. Creazione di due custom hook
Abbiamo estratto la logica in due hook riutilizzabili:

🔹 useCoins.ts
Gestisce la fetch delle coin tramite React Query.

Tipizzazione forte con Crypto[].

Componente Home ora riceve dati già pronti e tipizzati.

🔹 useFavorites.ts
Gestisce preferiti + localStorage.

Logica isolata e riutilizzabile in più pagine (Home, Preferiti, ecc.).

 4. Miglioramento della tipizzazione
Aggiunto il tipo Crypto e applicato a React Query.

Risolti errori su c in filter e map.

Tipizzato correttamente l’evento onChange.

 5. Pulizia della struttura del progetto
Creata cartella /hooks per separare la business logic.

Import corretti con path relativi (../../hooks/...).

Home.tsx ora è molto più leggibile e modulare.