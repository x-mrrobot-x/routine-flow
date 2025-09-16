const DEFAULT_ROUTINES = [
  {
    id: 1003,
    title: "Morning Exercise Time",
    description: "30 minutes of exercise to start the day with energy",
    commands: ["/open FitnessApp"],
    priority: "high",
    time: 23400,
    frequency: [1, 3, 5],
    active: true,
    categoryId: "health"
  },
  {
    id: 1002,
    title: "Desligar Wi-Fi para Sair de Casa",
    description: "Desligar o Wi-Fi ao sair para economizar bateria",
    commands: ["/wifi off"],
    priority: "medium",
    time: 27000,
    frequency: [1, 2, 3, 4, 5],
    active: true,
    categoryId: "work"
  },
  {
    id: 1004,
    title: "Activar Internet Móvil para el Trayecto",
    description: "Activar datos móviles para conectividad externa",
    commands: ["/mobile_data on"],
    priority: "medium",
    time: 27060,
    frequency: [1, 2, 3, 4, 5],
    active: true,
    categoryId: "work"
  },
  {
    id: 1005,
    title: "Preparing Bluetooth for Car",
    description: "Turns on Bluetooth for automatic car connection",
    commands: ["/bluetooth on"],
    priority: "medium",
    time: 27120,
    frequency: [1, 2, 3, 4, 5],
    active: true,
    categoryId: "work"
  },
  {
    id: 1008,
    title: "Iniciar Playlist Motivacional",
    description: "Abrir Spotify para playlists motivacionais",
    commands: ["/open Spotify"],
    priority: "low",
    time: 27180,
    frequency: [1, 2, 3, 4, 5],
    active: true,
    categoryId: "work"
  },
  {
    id: 1006,
    title: "Activar Modo Concentración Total",
    description: "Activar modo avión para máxima productividad",
    commands: ["/airplane on"],
    priority: "high",
    time: 28800,
    frequency: [1, 2, 3, 4, 5],
    active: true,
    categoryId: "work"
  },
  {
    id: 1009,
    title: "Lunch Break and Relaxation Time",
    description: "Opens YouTube to relax during lunch break",
    commands: ["/open YouTube"],
    priority: "medium",
    time: 43200,
    frequency: [1, 2, 3, 4, 5],
    active: true,
    categoryId: "work"
  },
  {
    id: 1014,
    title: "Conectar ao Wi-Fi de Casa",
    description: "Ligar Wi-Fi ao chegar em casa",
    commands: ["/wifi on"],
    priority: "medium",
    time: 64800,
    frequency: [1, 2, 3, 4, 5],
    active: false,
    categoryId: "home"
  },
  {
    id: 1019,
    title: "Organizar la Semana",
    description: "Revisar metas y organizar agenda de la semana",
    commands: ["/open Calendar"],
    priority: "high",
    time: 66600,
    frequency: [0],
    active: true,
    categoryId: "general"
  },
  {
    id: 1015,
    title: "Programming Study Session",
    description: "Time to develop technical skills",
    commands: ["/open ChatGPT"],
    priority: "high",
    time: 68400,
    frequency: [1, 2, 3, 4, 5],
    active: true,
    categoryId: "study"
  },
  {
    id: 1016,
    title: "Remover Distrações dos Estudos",
    description: "Fechar Instagram para manter foco nos estudos",
    commands: ["/close Instagram"],
    priority: "high",
    time: 68460,
    frequency: [1, 2, 3, 4, 5],
    active: true,
    categoryId: "study"
  },
  {
    id: 1017,
    title: "Hora de Dormir: Bloquear Pantalla",
    description: "Bloquear pantalla para melhor qualidade do sono",
    commands: ["/lockscreen"],
    priority: "high",
    time: 82800,
    frequency: [0, 1, 2, 3, 4, 5, 6],
    active: true,
    categoryId: "general"
  },
  {
    id: 1013,
    title: "Automatic System Cleanup",
    description: "Executes system cleaning and optimization",
    commands: ["/run_task PhoneCleanup"],
    priority: "medium",
    time: 86340,
    frequency: [6],
    active: true,
    categoryId: "general"
  }
];