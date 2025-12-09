export type MenuItem =
  | {
      icon?: string;
      title: string;
      route: string;
      items?: undefined;
    }
  | {
      icon?: string;
      title: string;
      items: { icons?: string; label: string; route: string }[];
      route?: undefined;
    };

export const menu: MenuItem[] = [
  {
    icon: 'box',
    title: 'Alta de muestras',
    route: '/',
  },
  {
    icon: 'settings',
    title: 'Configuraciones',
    items: [
      {
        label: 'Areas',
        route: '/settings',
      },
      {
        label: 'Elementos',
        route: '',
      },
      {
        label: 'Analisis',
        route: '',
      },
      {
        label: 'Procedencias',
        route: '',
      },
    ],
  },
];
