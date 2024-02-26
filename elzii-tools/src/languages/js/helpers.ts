export function toIdentifier(text: string): string {
  // step 1: replace joiners by underscores
  text = text.replace(/[- .]/g, '_')
  // step 2: remove characters that are not ascii letters, digits, underscores or dollar signs
  text = text.replace(/[^A-Za-z0-9_$]/g, '')
  // step 3: remove trailing underscores left from step 1
  text = text.replace(/_+$/g, '')
  // step 4: if it starts with a digit, prefix it with an underscore
  if (text.match(/^[0-9]/)) text = '_' + text

  return text
}
