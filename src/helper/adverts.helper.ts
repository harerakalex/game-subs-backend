export const getDailyIncome = (subscription: number) => {
  const ROI = 3.5;
  const numberOfGames = 4;

  // formula income = ((subscription * ROI)/100)/numberOfGames
  const income = (subscription * ROI) / 100 / numberOfGames;

  return income;
};
