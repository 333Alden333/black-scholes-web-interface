# Black-Scholes Options Web Interface

A professional web interface for the [Black-Scholes Options Tool](https://github.com/333Alden333/black-scholes-options-tool) that allows users to analyze options pricing and trading opportunities through a browser instead of command-line interaction.

## Features

- **Complete Black-Scholes Implementation**: Accurate theoretical option pricing with dividend adjustments
- **Real-time Greeks Calculations**: Delta, Gamma, Theta, Vega, and Rho analysis
- **Implied Volatility Calculation**: Newton-Raphson method for extracting IV from market prices
- **Trading Confirmation System**: Automated buy/sell/hold recommendations with confidence levels
- **Professional UI**: Clean, technical interface inspired by U.S. Graphics design principles
- **Responsive Design**: Works on desktop and mobile devices

## Design Philosophy

This interface follows the U.S. Graphics design philosophy:
- **Emergent over prescribed aesthetics**
- **Expose state and inner workings**
- **Performance is design**
- **Driven by objective reasoning and common sense**

The design prioritizes functionality, information density, and technical precision over decorative elements.

## Usage

1. **Open `index.html`** in your web browser
2. **Enter Option Contract Details**:
   - Underlying symbol (e.g., AAPL)
   - Strike price
   - Expiration date
   - Option type (Call/Put)
   - Current option price (optional, for trading recommendations)

3. **Enter Market Data**:
   - Current underlying price
   - Risk-free rate (%)
   - Dividend yield (%)
   - Volatility estimate (% - optional, will calculate from market price if not provided)
   - Edge threshold for trading recommendations (%)

4. **Click "Calculate Black-Scholes Analysis"** to get results

## Output

The interface provides three main sections of analysis:

### Theoretical Pricing
- **Fair Value**: Black-Scholes calculated theoretical price
- **Implied Volatility**: Volatility implied by current market price (if provided)

### The Greeks
- **Delta (Δ)**: Price sensitivity to underlying price changes
- **Gamma (Γ)**: Delta acceleration
- **Theta (Θ)**: Time decay (daily)
- **Vega (ν)**: Volatility sensitivity
- **Rho (ρ)**: Interest rate sensitivity

### Trading Recommendation
- **Action**: BUY/SELL/HOLD/AVOID recommendation
- **Confidence**: Confidence level in the recommendation
- **Edge**: Percentage edge (positive = undervalued, negative = overvalued)
- **Analysis**: Detailed reasoning with Greeks summary

## Technical Implementation

The web interface is built with vanilla JavaScript and implements the complete Black-Scholes model including:

- Standard normal cumulative distribution function
- Standard normal probability density function
- All Greeks calculations
- Implied volatility calculation using Newton-Raphson method
- Trading signal generation with configurable edge thresholds

## Files

- `index.html` - Main HTML structure and form
- `script.js` - Complete Black-Scholes calculator and UI logic
- `styles.css` - Technical, monospace styling following U.S. Graphics principles
- `README.md` - This documentation

## Browser Compatibility

Works in all modern browsers that support:
- ES6 JavaScript features
- CSS Grid
- CSS Custom Properties (CSS Variables)

## Disclaimer

This tool provides theoretical analysis based on the Black-Scholes model. Options trading involves substantial risk and is not suitable for all investors. Always combine with fundamental analysis, technical analysis, and proper risk management.

The Black-Scholes model has limitations:
- Assumes constant volatility (real markets have volatility clustering)
- European exercise assumption (American options have early exercise premiums)
- No transaction costs included
- Perfect liquidity assumed

## Related Projects

- [Original Black-Scholes Options Tool](https://github.com/333Alden333/black-scholes-options-tool) - Python command-line version
- [U.S. Graphics Company](https://usgraphics.com) - Design philosophy inspiration

## License

This project is for educational purposes. Please ensure compliance with your local financial regulations.