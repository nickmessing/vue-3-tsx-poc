export function transformOn (obj) {
  const result = {}
  for (const event in obj) {
    result['on' + event[0].toUpperCase() + event.substr(1)] = obj[event] 
  }
  return result
}