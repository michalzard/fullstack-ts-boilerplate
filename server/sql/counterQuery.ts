export const increaseCounter: string = `
UPDATE persistance SET counter = counter + 1 RETURNING counter;
`;