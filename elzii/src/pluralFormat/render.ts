export class PluralFormRenderer {
  public static render(parts: string[], formattedNumber: string): string {
    let finalText = ''
    let firstPart = true

    for (const part of parts) {
      if (!firstPart) finalText += formattedNumber
      finalText += part
      firstPart = false
    }

    return finalText
  }
}
