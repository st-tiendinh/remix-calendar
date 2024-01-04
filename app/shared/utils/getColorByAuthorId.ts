export const getColor = (id: string): string => {
  const colors = ['rose', 'amber', 'green', 'violet', 'blue'];
  const numericId = parseInt(id, 16);
  return colors[numericId % colors.length];
};
