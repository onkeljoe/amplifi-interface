/**
 * 
 * @param oldValue 
 * @param newValue 
 * @returns in percent form
 */
export const calcChange = (oldValue : number, newValue : number) => {
  if (oldValue === 0) {
    return 100
  } 
  return (newValue/oldValue - 1) * 100
}

export const formatChange = (change : number) => {
  if (typeof change !== 'number') {
    return '0%'
  }
  return (change).toFixed(2) + '%'
} 

