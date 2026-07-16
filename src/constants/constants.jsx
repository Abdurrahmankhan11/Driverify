export const constants = {
  isOnline: true,
  isOffline: true,


  baseUrl: "https://br2bkzxc-8000.inc1.devtunnels.ms",//Shabaz
  // baseUrl: "https://vx1wlxgw-8000.inc1.devtunnels.ms",// Noor
  // baseUrl: "https://h61zcd0b-8000.inc1.devtunnels.ms", // Manal




  hideEdgeRevealStyle: `
      input[type="password"]::-ms-reveal,   
      input[type="password"]::-ms-clear {
        display: none;
      }
    `,
  roles: {
    USER: 'USER',
    MIDDLEMAN: 'MIDDLEMAN',
    ADMIN: 'ADMIN',
  }
};

export const locationData = {
  countries: [
    { id: 1, name: 'India' }
  ],
  states: [
    { id: 4, countryId: 1, name: 'Maharashtra' },
    { id: 2, countryId: 1, name: 'Karnataka' },
    { id: 3, countryId: 1, name: 'Delhi' },
    { id: 5, countryId: 1, name: 'Tamil Nadu' }
  ],
  cities: [
    { id: 12, stateId: 4, name: 'Mumbai' },
    { id: 13, stateId: 4, name: 'Pune' },
    { id: 14, stateId: 2, name: 'Bangalore' },
    { id: 15, stateId: 3, name: 'New Delhi' },
    { id: 16, stateId: 5, name: 'Chennai' }
  ]
};

const urlParts = constants.baseUrl.split("-");
if (urlParts.length > 1) {
  const portPart = urlParts[1].split(".")[0];
  if (!isNaN(portPart)) {
    constants.PORT = parseInt(portPart, 10);
  }
}
