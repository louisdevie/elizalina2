import {
  CurrencyDisplay,
  CurrencyNumberFormat,
  CurrencySign,
  DigitsFormat,
  DigitsFormatOptions,
  NumberFormat,
  NumberFormatOptions,
  NumberNotation,
  PercentNumberFormat,
  RoundingMode,
  SignDisplay,
  UnitDisplay,
  UnitNumberFormat,
} from '../number'
import { FormatOptions } from '..'

export abstract class DigitsFormatImpl<This> implements DigitsFormat<This> {
  protected abstract get options(): DigitsFormatOptions

  public integer(minDigits: number = 0): This {
    this.options.minimumIntegerDigits = minDigits
    this.options.maximumFractionDigits = 0
    return this as unknown as This
  }

  public fixed(digits: number): This {
    this.options.minimumFractionDigits = digits
    this.options.maximumFractionDigits = digits
    return this as unknown as This
  }

  decimal(maxDigits: number): This
  decimal(minDigits: number, maxDigits: number): This
  public decimal(minOrMaxOnly: number, maxDigits?: number): This {
    if (maxDigits !== undefined) {
      this.options.minimumFractionDigits = minOrMaxOnly
      this.options.maximumFractionDigits = maxDigits
    } else {
      this.options.minimumFractionDigits = 0
      this.options.maximumFractionDigits = minOrMaxOnly
    }
    return this as unknown as This
  }

  public significant(digits: number): This {
    this.options.maximumSignificantDigits = digits
    return this as unknown as This
  }

  public round(mode: RoundingMode): This {
    this.options.roundingMode = mode
    return this as unknown as This
  }

  public get ceil(): This {
    return this.round('ceil')
  }

  public get floor(): This {
    return this.round('floor')
  }

  public get expand(): This {
    return this.round('expand')
  }

  public get trunc(): This {
    return this.round('trunc')
  }

  public get halfCeil(): This {
    return this.round('halfCeil')
  }

  public get halfFloor(): This {
    return this.round('halfFloor')
  }

  public get halfExpand(): This {
    return this.round('halfExpand')
  }

  public get halfTrunc(): This {
    return this.round('halfTrunc')
  }

  public get halfEven(): This {
    return this.round('halfEven')
  }

  public useGrouping(grouping: boolean): This {
    this.options.useGrouping = grouping
    return this as unknown as This
  }

  public get group(): This {
    return this.useGrouping(true)
  }

  public get dontGroup(): This {
    return this.useGrouping(false)
  }

  notation(notation: NumberNotation): This {
    this.options.notation = notation
    return this as unknown as This
  }

  get standardNotation(): This {
    return this.notation('standard')
  }

  get scientific(): This {
    return this.notation('scientific')
  }

  get engineering(): This {
    return this.notation('engineering')
  }

  get longCompact(): This {
    return this.notation('longCompact')
  }

  get compact(): This {
    return this.notation('compact')
  }
}

export class NumberFormatImpl
  extends DigitsFormatImpl<NumberFormatImpl>
  implements NumberFormat, CurrencyNumberFormat, PercentNumberFormat, UnitNumberFormat
{
  private readonly _options: NumberFormatOptions

  public constructor(language: string) {
    super()

    this._options = { type: 'number', language }
  }

  protected get options(): NumberFormatOptions {
    return this._options
  }

  public toOptions(): NumberFormatOptions {
    return this.options
  }

  public numberingSystem(name: string): NumberFormatImpl {
    this.options.numberingSystem = name
    return this
  }

  public displaySign(when: SignDisplay): NumberFormatImpl {
    this.options.signDisplay = when
    return this
  }

  public currency(code: string): NumberFormatImpl {
    this.options.style = 'currency'
    this.options.currency = code
    return this
  }

  public currencyDisplay(display: CurrencyDisplay): NumberFormatImpl {
    this.options.currencyDisplay = display
    return this
  }

  public get code(): NumberFormatImpl {
    return this.currencyDisplay('code')
  }

  public get symbol(): NumberFormatImpl {
    return this.currencyDisplay('symbol')
  }

  public get narrowSymbol(): NumberFormatImpl {
    return this.currencyDisplay('narrowSymbol')
  }

  public get name(): NumberFormatImpl {
    return this.currencyDisplay('name')
  }

  public currencySign(sign: CurrencySign): NumberFormatImpl {
    this.options.currencySign = sign
    return this
  }

  get standardSign(): NumberFormatImpl {
    return this.currencySign('standard')
  }

  get accounting(): NumberFormatImpl {
    return this.currencySign('accounting')
  }

  public get percent(): NumberFormatImpl {
    this.options.style = 'percent'
    return this
  }

  public unit(name: string): NumberFormatImpl {
    this.options.style = 'unit'
    this.options.unit = name
    return this
  }

  public unitDisplay(display: UnitDisplay): NumberFormatImpl {
    this.options.unitDisplay = display
    return this
  }

  public get short(): NumberFormatImpl {
    return this.unitDisplay('short')
  }

  public get narrow(): NumberFormatImpl {
    return this.unitDisplay('narrow')
  }

  public get long(): NumberFormatImpl {
    return this.unitDisplay('long')
  }
}
