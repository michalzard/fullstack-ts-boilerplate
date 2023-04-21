export const initializeCounter: string = `
CREATE TABLE IF NOT EXISTS persistance(counter INT DEFAULT 0); 
INSERT INTO persistance(counter) SELECT 0 WHERE NOT EXISTS(SELECT counter FROM persistance);
`
export const increaseCounter: string = `
UPDATE persistance SET counter = counter + 1 RETURNING counter;
`;