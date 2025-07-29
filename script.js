// Black-Scholes Options Calculator JavaScript Implementation
class BlackScholesCalculator {
    constructor() {
        this.TRADING_DAYS_PER_YEAR = 252;
        this.SECONDS_PER_YEAR = 365.25 * 24 * 3600;
    }

    // Standard normal cumulative distribution function
    normCDF(x) {
        const a1 =  0.254829592;
        const a2 = -0.284496736;
        const a3 =  1.421413741;
        const a4 = -1.453152027;
        const a5 =  1.061405429;
        const p  =  0.3275911;

        const sign = x < 0 ? -1 : 1;
        x = Math.abs(x) / Math.sqrt(2.0);

        const t = 1.0 / (1.0 + p * x);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

        return 0.5 * (1.0 + sign * y);
    }

    // Standard normal probability density function
    normPDF(x) {
        return (1.0 / Math.sqrt(2.0 * Math.PI)) * Math.exp(-0.5 * x * x);
    }

    // Calculate time to expiration in years
    timeToExpiration(expirationDate, currentDate = new Date()) {
        const timeDiff = expirationDate.getTime() - currentDate.getTime();
        return Math.max(timeDiff / (this.SECONDS_PER_YEAR * 1000), 0.0);
    }

    // Black-Scholes option pricing formula
    blackScholesPrice(spotPrice, strikePrice, timeToExpiry, riskFreeRate, volatility, optionType, dividendYield = 0.0) {
        if (timeToExpiry <= 0) {
            if (optionType === 'call') {
                return Math.max(spotPrice - strikePrice, 0);
            } else {
                return Math.max(strikePrice - spotPrice, 0);
            }
        }

        const adjustedSpot = spotPrice * Math.exp(-dividendYield * timeToExpiry);
        const d1 = (Math.log(adjustedSpot / strikePrice) + (riskFreeRate + 0.5 * volatility * volatility) * timeToExpiry) / 
                   (volatility * Math.sqrt(timeToExpiry));
        const d2 = d1 - volatility * Math.sqrt(timeToExpiry);

        if (optionType === 'call') {
            return adjustedSpot * this.normCDF(d1) - 
                   strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * this.normCDF(d2);
        } else {
            return strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * this.normCDF(-d2) - 
                   adjustedSpot * this.normCDF(-d1);
        }
    }

    // Calculate option delta
    calculateDelta(spotPrice, strikePrice, timeToExpiry, riskFreeRate, volatility, optionType, dividendYield = 0.0) {
        if (timeToExpiry <= 0) {
            if (optionType === 'call') {
                return spotPrice > strikePrice ? 1.0 : 0.0;
            } else {
                return spotPrice < strikePrice ? -1.0 : 0.0;
            }
        }

        const adjustedSpot = spotPrice * Math.exp(-dividendYield * timeToExpiry);
        const d1 = (Math.log(adjustedSpot / strikePrice) + (riskFreeRate + 0.5 * volatility * volatility) * timeToExpiry) / 
                   (volatility * Math.sqrt(timeToExpiry));

        if (optionType === 'call') {
            return Math.exp(-dividendYield * timeToExpiry) * this.normCDF(d1);
        } else {
            return -Math.exp(-dividendYield * timeToExpiry) * this.normCDF(-d1);
        }
    }

    // Calculate option gamma
    calculateGamma(spotPrice, strikePrice, timeToExpiry, riskFreeRate, volatility, dividendYield = 0.0) {
        if (timeToExpiry <= 0) {
            return 0.0;
        }

        const adjustedSpot = spotPrice * Math.exp(-dividendYield * timeToExpiry);
        const d1 = (Math.log(adjustedSpot / strikePrice) + (riskFreeRate + 0.5 * volatility * volatility) * timeToExpiry) / 
                   (volatility * Math.sqrt(timeToExpiry));

        return (Math.exp(-dividendYield * timeToExpiry) * this.normPDF(d1)) / 
               (spotPrice * volatility * Math.sqrt(timeToExpiry));
    }

    // Calculate option theta (time decay)
    calculateTheta(spotPrice, strikePrice, timeToExpiry, riskFreeRate, volatility, optionType, dividendYield = 0.0) {
        if (timeToExpiry <= 0) {
            return 0.0;
        }

        const adjustedSpot = spotPrice * Math.exp(-dividendYield * timeToExpiry);
        const d1 = (Math.log(adjustedSpot / strikePrice) + (riskFreeRate + 0.5 * volatility * volatility) * timeToExpiry) / 
                   (volatility * Math.sqrt(timeToExpiry));
        const d2 = d1 - volatility * Math.sqrt(timeToExpiry);

        let theta;
        if (optionType === 'call') {
            theta = ((-adjustedSpot * this.normPDF(d1) * volatility) / (2 * Math.sqrt(timeToExpiry)) +
                    dividendYield * adjustedSpot * this.normCDF(d1) -
                    riskFreeRate * strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * this.normCDF(d2));
        } else {
            theta = ((-adjustedSpot * this.normPDF(d1) * volatility) / (2 * Math.sqrt(timeToExpiry)) -
                    dividendYield * adjustedSpot * this.normCDF(-d1) +
                    riskFreeRate * strikePrice * Math.exp(-riskFreeRate * timeToExpiry) * this.normCDF(-d2));
        }

        return theta / 365.25; // Convert to daily theta
    }

    // Calculate option vega
    calculateVega(spotPrice, strikePrice, timeToExpiry, riskFreeRate, volatility, dividendYield = 0.0) {
        if (timeToExpiry <= 0) {
            return 0.0;
        }

        const adjustedSpot = spotPrice * Math.exp(-dividendYield * timeToExpiry);
        const d1 = (Math.log(adjustedSpot / strikePrice) + (riskFreeRate + 0.5 * volatility * volatility) * timeToExpiry) / 
                   (volatility * Math.sqrt(timeToExpiry));

        return adjustedSpot * this.normPDF(d1) * Math.sqrt(timeToExpiry) / 100; // Convert to 1% vol change
    }

    // Calculate option rho
    calculateRho(spotPrice, strikePrice, timeToExpiry, riskFreeRate, volatility, optionType, dividendYield = 0.0) {
        if (timeToExpiry <= 0) {
            return 0.0;
        }

        const adjustedSpot = spotPrice * Math.exp(-dividendYield * timeToExpiry);
        const d1 = (Math.log(adjustedSpot / strikePrice) + (riskFreeRate + 0.5 * volatility * volatility) * timeToExpiry) / 
                   (volatility * Math.sqrt(timeToExpiry));
        const d2 = d1 - volatility * Math.sqrt(timeToExpiry);

        let rho;
        if (optionType === 'call') {
            rho = strikePrice * timeToExpiry * Math.exp(-riskFreeRate * timeToExpiry) * this.normCDF(d2);
        } else {
            rho = -strikePrice * timeToExpiry * Math.exp(-riskFreeRate * timeToExpiry) * this.normCDF(-d2);
        }

        return rho / 100; // Convert to 1% rate change
    }

    // Calculate implied volatility using Newton-Raphson method
    calculateImpliedVolatility(optionPrice, spotPrice, strikePrice, timeToExpiry, riskFreeRate, optionType, dividendYield = 0.0, maxIterations = 100, tolerance = 1e-6) {
        if (timeToExpiry <= 0) {
            return null;
        }

        let volatility = 0.3; // Initial guess

        for (let i = 0; i < maxIterations; i++) {
            const price = this.blackScholesPrice(spotPrice, strikePrice, timeToExpiry, riskFreeRate, volatility, optionType, dividendYield);
            const vega = this.calculateVega(spotPrice, strikePrice, timeToExpiry, riskFreeRate, volatility, dividendYield) * 100;

            const priceDiff = price - optionPrice;

            if (Math.abs(priceDiff) < tolerance) {
                return volatility;
            }

            if (vega === 0) {
                break;
            }

            volatility -= priceDiff / vega;
            volatility = Math.max(0.001, Math.min(volatility, 5.0));
        }

        return null;
    }

    // Complete analysis
    analyzeOption(contract, marketData, volatilityEstimate = null) {
        const timeToExpiry = this.timeToExpiration(contract.expirationDate, marketData.timestamp);

        // Determine volatility to use
        let volatility = volatilityEstimate;
        if (!volatility && contract.currentPrice) {
            volatility = this.calculateImpliedVolatility(
                contract.currentPrice,
                marketData.underlyingPrice,
                contract.strikePrice,
                timeToExpiry,
                marketData.riskFreeRate,
                contract.optionType,
                marketData.dividendYield
            );
        }
        if (!volatility) {
            volatility = 0.3; // Default 30% volatility
        }

        const theoreticalPrice = this.blackScholesPrice(
            marketData.underlyingPrice,
            contract.strikePrice,
            timeToExpiry,
            marketData.riskFreeRate,
            volatility,
            contract.optionType,
            marketData.dividendYield
        );

        const delta = this.calculateDelta(
            marketData.underlyingPrice,
            contract.strikePrice,
            timeToExpiry,
            marketData.riskFreeRate,
            volatility,
            contract.optionType,
            marketData.dividendYield
        );

        const gamma = this.calculateGamma(
            marketData.underlyingPrice,
            contract.strikePrice,
            timeToExpiry,
            marketData.riskFreeRate,
            volatility,
            marketData.dividendYield
        );

        const theta = this.calculateTheta(
            marketData.underlyingPrice,
            contract.strikePrice,
            timeToExpiry,
            marketData.riskFreeRate,
            volatility,
            contract.optionType,
            marketData.dividendYield
        );

        const vega = this.calculateVega(
            marketData.underlyingPrice,
            contract.strikePrice,
            timeToExpiry,
            marketData.riskFreeRate,
            volatility,
            marketData.dividendYield
        );

        const rho = this.calculateRho(
            marketData.underlyingPrice,
            contract.strikePrice,
            timeToExpiry,
            marketData.riskFreeRate,
            volatility,
            contract.optionType,
            marketData.dividendYield
        );

        return {
            theoreticalPrice,
            delta,
            gamma,
            theta,
            vega,
            rho,
            impliedVolatility: volatility,
            timeToExpiry
        };
    }

    // Generate trading signal
    generateTradingSignal(contract, marketData, result, edgeThreshold = 0.10) {
        if (!contract.currentPrice) {
            return {
                action: "HOLD",
                confidence: 0.0,
                reasoning: "No market price available for analysis",
                fairValue: result.theoreticalPrice,
                marketPrice: 0.0,
                edge: 0.0
            };
        }

        const fairValue = result.theoreticalPrice;
        const marketPrice = contract.currentPrice;
        const edge = marketPrice > 0 ? (fairValue - marketPrice) / marketPrice : 0;

        // Check time to expiry
        const minTimeToExpiry = 0.02; // ~1 week
        if (result.timeToExpiry < minTimeToExpiry) {
            return {
                action: "AVOID",
                confidence: 0.8,
                reasoning: `Option expires too soon (${result.timeToExpiry.toFixed(3)} years remaining)`,
                fairValue,
                marketPrice,
                edge
            };
        }

        // Generate trading signal based on edge
        const confidence = Math.min(Math.abs(edge) / edgeThreshold, 1.0);

        let action, reasoning;
        if (edge > edgeThreshold) {
            action = "BUY";
            reasoning = `Option undervalued by ${(edge * 100).toFixed(1)}%. Fair value: $${fairValue.toFixed(2)} vs Market: $${marketPrice.toFixed(2)}`;
        } else if (edge < -edgeThreshold) {
            action = "SELL";
            reasoning = `Option overvalued by ${(Math.abs(edge) * 100).toFixed(1)}%. Fair value: $${fairValue.toFixed(2)} vs Market: $${marketPrice.toFixed(2)}`;
        } else {
            action = "HOLD";
            reasoning = `Option fairly valued (edge: ${(edge * 100).toFixed(1)}%). Fair value: $${fairValue.toFixed(2)} vs Market: $${marketPrice.toFixed(2)}`;
        }

        reasoning += `\nGreeks - Delta: ${result.delta.toFixed(3)}, Theta: ${result.theta.toFixed(2)}, Vega: ${result.vega.toFixed(2)}`;

        return {
            action,
            confidence: action === "HOLD" ? 1.0 - confidence : confidence,
            reasoning,
            fairValue,
            marketPrice,
            edge
        };
    }
}

// DOM manipulation and form handling
class OptionsAnalyzerUI {
    constructor() {
        this.calculator = new BlackScholesCalculator();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const form = document.getElementById('optionsForm');
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Set minimum date to today
        const expiryInput = document.getElementById('expiry');
        const today = new Date();
        const minDate = today.toISOString().split('T')[0];
        expiryInput.min = minDate;
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.showLoading();
        this.hideError();

        try {
            const formData = this.getFormData();
            const result = this.calculator.analyzeOption(formData.contract, formData.marketData, formData.volatilityEstimate);
            const signal = this.calculator.generateTradingSignal(formData.contract, formData.marketData, result, formData.edgeThreshold);
            
            // Store original contract and market data in result for PnL calculations
            result.originalContract = formData.contract;
            result.originalMarketData = formData.marketData;
            
            this.displayResults(result, signal, formData.pnlData);
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.hideLoading();
        }
    }

    getFormData() {
        const form = document.getElementById('optionsForm');
        const formData = new FormData(form);

        // Parse form data
        const symbol = formData.get('symbol').toUpperCase();
        const strikePrice = parseFloat(formData.get('strike'));
        const expirationDate = new Date(formData.get('expiry'));
        const optionType = formData.get('optionType');
        const currentPrice = formData.get('currentPrice') ? parseFloat(formData.get('currentPrice')) : null;
        const underlyingPrice = parseFloat(formData.get('underlyingPrice'));
        const riskFreeRate = parseFloat(formData.get('riskFreeRate')) / 100; // Convert percentage to decimal
        const dividendYield = parseFloat(formData.get('dividendYield')) / 100;
        const volatilityEstimate = formData.get('volatility') ? parseFloat(formData.get('volatility')) / 100 : null;
        const edgeThreshold = parseFloat(formData.get('edgeThreshold')) / 100;

        // PnL analysis data
        const positionSize = formData.get('positionSize') ? parseInt(formData.get('positionSize')) : null;
        const priceTarget1 = formData.get('priceTarget1') ? parseFloat(formData.get('priceTarget1')) : null;
        const priceTarget2 = formData.get('priceTarget2') ? parseFloat(formData.get('priceTarget2')) : null;
        const priceTarget3 = formData.get('priceTarget3') ? parseFloat(formData.get('priceTarget3')) : null;

        // Validation
        if (!symbol || isNaN(strikePrice) || !expirationDate || !optionType || isNaN(underlyingPrice) || isNaN(riskFreeRate)) {
            throw new Error('Please fill in all required fields with valid values');
        }

        if (expirationDate <= new Date()) {
            throw new Error('Expiration date must be in the future');
        }

        const contract = {
            underlyingSymbol: symbol,
            strikePrice,
            expirationDate,
            optionType,
            currentPrice
        };

        const marketData = {
            underlyingPrice,
            riskFreeRate,
            dividendYield,
            timestamp: new Date()
        };

        const pnlData = {
            positionSize,
            priceTargets: [priceTarget1, priceTarget2, priceTarget3].filter(target => target !== null)
        };

        return {
            contract,
            marketData,
            volatilityEstimate,
            edgeThreshold,
            pnlData
        };
    }

    displayResults(result, signal, pnlData) {
        // Update theoretical pricing
        document.getElementById('fairValue').textContent = `$${result.theoreticalPrice.toFixed(2)}`;
        document.getElementById('impliedVol').textContent = `${(result.impliedVolatility * 100).toFixed(1)}%`;

        // Update Greeks
        document.getElementById('delta').textContent = result.delta.toFixed(4);
        document.getElementById('gamma').textContent = result.gamma.toFixed(4);
        document.getElementById('theta').textContent = `$${result.theta.toFixed(2)}/day`;
        document.getElementById('vega').textContent = `$${result.vega.toFixed(2)}/1% vol`;
        document.getElementById('rho').textContent = `$${result.rho.toFixed(2)}/1% rate`;

        // Update trading recommendation if market price is available
        const tradingCard = document.getElementById('tradingCard');
        if (signal.marketPrice > 0) {
            tradingCard.classList.remove('hidden');
            
            const actionElement = document.getElementById('action');
            actionElement.textContent = signal.action;
            actionElement.className = `value action-value action-${signal.action.toLowerCase()}`;
            
            document.getElementById('confidence').textContent = `${(signal.confidence * 100).toFixed(1)}%`;
            document.getElementById('edge').textContent = `${(signal.edge * 100).toFixed(1)}%`;
            document.getElementById('marketPrice').textContent = `$${signal.marketPrice.toFixed(2)}`;
            document.getElementById('reasoning').textContent = signal.reasoning;
        } else {
            tradingCard.classList.add('hidden');
        }

        // Update PnL analysis if position size and targets are provided
        this.displayPnLAnalysis(result, signal, pnlData);

        this.showResults();
    }

    displayPnLAnalysis(result, signal, pnlData) {
        const pnlCard = document.getElementById('pnlCard');
        
        if (!pnlData.positionSize || pnlData.priceTargets.length === 0) {
            pnlCard.classList.add('hidden');
            return;
        }

        pnlCard.classList.remove('hidden');

        // Display position size and total investment
        document.getElementById('displayPositionSize').textContent = `${pnlData.positionSize} contracts`;
        
        const currentOptionPrice = signal.marketPrice || result.theoreticalPrice;
        const totalInvestment = pnlData.positionSize * currentOptionPrice * 100; // 100 shares per contract
        document.getElementById('totalInvestment').textContent = `$${totalInvestment.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

        // Calculate and display PnL for each target
        pnlData.priceTargets.forEach((target, index) => {
            if (target && index < 3) { // Limit to 3 targets
                const targetElement = document.getElementById(`pnlTarget${index + 1}`);
                if (targetElement) {
                    this.calculateAndDisplayTargetPnL(targetElement, target, result, currentOptionPrice, pnlData.positionSize, totalInvestment, index + 1);
                }
            }
        });

        // Hide unused target elements
        for (let i = pnlData.priceTargets.length; i < 3; i++) {
            const targetElement = document.getElementById(`pnlTarget${i + 1}`);
            if (targetElement) {
                targetElement.style.display = 'none';
            }
        }
    }

    calculateAndDisplayTargetPnL(targetElement, targetPrice, result, currentOptionPrice, positionSize, totalInvestment, targetNumber) {
        // Use the stored original contract and market data
        const contract = result.originalContract;
        const originalMarketData = result.originalMarketData;

        // Use the same volatility that was used in the original calculation
        const targetOptionValue = this.calculator.blackScholesPrice(
            targetPrice,
            contract.strikePrice,
            result.timeToExpiry,
            originalMarketData.riskFreeRate,
            result.impliedVolatility,
            contract.optionType,
            originalMarketData.dividendYield
        );

        // Calculate PnL
        const totalTargetValue = positionSize * targetOptionValue * 100;
        const pnl = totalTargetValue - totalInvestment;
        const pnlPercent = (pnl / totalInvestment) * 100;

        // Update the display
        targetElement.style.display = 'block';
        
        const targetPriceSpan = targetElement.querySelector('.target-price');
        const targetPnlSpan = targetElement.querySelector('.target-pnl');
        const optionValueSpan = targetElement.querySelector('.option-value');
        const pnlPercentSpan = targetElement.querySelector('.pnl-percent');

        if (targetPriceSpan) targetPriceSpan.textContent = `Target ${targetNumber}: $${targetPrice.toFixed(2)}`;
        if (targetPnlSpan) {
            targetPnlSpan.textContent = `PnL: ${pnl >= 0 ? '+' : ''}$${pnl.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            targetPnlSpan.className = `target-pnl ${pnl >= 0 ? 'positive' : 'negative'}`;
        }
        if (optionValueSpan) optionValueSpan.textContent = `Option Value: $${targetOptionValue.toFixed(2)}`;
        if (pnlPercentSpan) {
            pnlPercentSpan.textContent = `Return: ${pnlPercent >= 0 ? '+' : ''}${pnlPercent.toFixed(1)}%`;
            pnlPercentSpan.className = `pnl-percent ${pnlPercent >= 0 ? 'positive' : 'negative'}`;
        }
    }

    showLoading() {
        document.getElementById('loadingIndicator').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loadingIndicator').classList.add('hidden');
    }

    showResults() {
        document.getElementById('results').classList.remove('hidden');
    }

    showError(message) {
        document.getElementById('errorMessage').textContent = message;
        document.getElementById('error').classList.remove('hidden');
    }

    hideError() {
        document.getElementById('error').classList.add('hidden');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new OptionsAnalyzerUI();
});