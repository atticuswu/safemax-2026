import React, { useState, useMemo, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ReferenceLine
} from 'recharts';
import {
  AlertTriangle,
  ShieldCheck,
  Calculator,
  History,
  DollarSign,
  Calendar,
  Zap,
  ArrowRightLeft,
  Lock,
  X,
  Mail,
  Info
} from 'lucide-react';
import './index.css';

const HISTORICAL_DATA = {
  1966: { ret: -10.06, cpi: 3.01, cape: 24.1 }, 1967: { ret: 23.98, cpi: 2.78, cape: 21.0 }, 1968: { ret: 11.06, cpi: 4.27, cape: 22.3 }, 1969: { ret: -8.50, cpi: 5.46, cape: 21.2 }, 1970: { ret: 4.01, cpi: 5.92, cape: 15.9 },
  1971: { ret: 14.31, cpi: 4.30, cape: 18.1 }, 1972: { ret: 18.98, cpi: 3.27, cape: 18.6 }, 1973: { ret: -14.66, cpi: 6.22, cape: 18.1 }, 1974: { ret: -26.47, cpi: 11.04, cape: 8.3 }, 1975: { ret: 37.20, cpi: 9.14, cape: 8.3 },
  1976: { ret: 23.84, cpi: 5.74, cape: 10.7 }, 1977: { ret: -7.18, cpi: 6.50, cape: 10.1 }, 1978: { ret: 6.56, cpi: 7.62, cape: 8.5 }, 1979: { ret: 18.44, cpi: 11.25, cape: 8.9 }, 1980: { ret: 32.42, cpi: 13.58, cape: 9.0 },
  1981: { ret: -4.91, cpi: 10.33, cape: 9.2 }, 1982: { ret: 21.55, cpi: 6.13, cape: 6.9 }, 1983: { ret: 22.56, cpi: 3.21, cape: 9.7 }, 1984: { ret: 6.27, cpi: 4.30, cape: 9.0 }, 1985: { ret: 31.73, cpi: 3.55, cape: 10.4 },
  1986: { ret: 18.67, cpi: 1.91, cape: 13.8 }, 1987: { ret: 5.25, cpi: 3.66, cape: 17.1 }, 1988: { ret: 16.61, cpi: 4.08, cape: 13.5 }, 1989: { ret: 31.69, cpi: 4.83, cape: 16.5 }, 1990: { ret: -3.10, cpi: 5.40, cape: 17.0 },
  1991: { ret: 30.47, cpi: 4.23, cape: 18.1 }, 1992: { ret: 7.62, cpi: 3.03, cape: 20.3 }, 1993: { ret: 10.08, cpi: 2.95, cape: 21.5 }, 1994: { ret: 1.32, cpi: 2.61, cape: 20.7 }, 1995: { ret: 37.58, cpi: 2.81, cape: 22.5 },
  1996: { ret: 22.96, cpi: 2.93, cape: 26.5 }, 1997: { ret: 33.36, cpi: 2.34, cape: 30.8 }, 1998: { ret: 28.58, cpi: 1.55, cape: 35.3 }, 1999: { ret: 21.04, cpi: 2.19, cape: 41.3 }, 2000: { ret: -9.10, cpi: 3.38, cape: 44.2 },
  2001: { ret: -11.89, cpi: 2.83, cape: 27.5 }, 2002: { ret: -22.10, cpi: 1.59, cape: 23.1 }, 2003: { ret: 28.68, cpi: 2.27, cape: 23.5 }, 2004: { ret: 10.88, cpi: 2.68, cape: 26.5 }, 2005: { ret: 4.91, cpi: 3.39, cape: 26.1 },
  2006: { ret: 15.79, cpi: 3.23, cape: 26.0 }, 2007: { ret: 5.49, cpi: 2.85, cape: 27.2 }, 2008: { ret: -37.00, cpi: 3.85, cape: 21.0 }, 2009: { ret: 26.46, cpi: -0.34, cape: 15.1 }, 2010: { ret: 15.06, cpi: 1.64, cape: 20.5 },
  2011: { ret: 2.11, cpi: 3.16, cape: 22.4 }, 2012: { ret: 16.00, cpi: 2.07, cape: 21.6 }, 2013: { ret: 32.39, cpi: 1.46, cape: 23.3 }, 2014: { ret: 13.69, cpi: 1.62, cape: 25.5 }, 2015: { ret: 1.38, cpi: 0.12, cape: 26.6 },
  2016: { ret: 11.96, cpi: 1.26, cape: 25.7 }, 2017: { ret: 21.83, cpi: 2.13, cape: 29.5 }, 2018: { ret: -4.38, cpi: 2.44, cape: 32.0 }, 2019: { ret: 31.49, cpi: 1.81, cape: 30.1 }, 2020: { ret: 18.40, cpi: 1.23, cape: 30.9 },
  2021: { ret: 28.71, cpi: 4.70, cape: 36.9 }, 2022: { ret: -18.11, cpi: 8.00, cape: 34.2 }, 2023: { ret: 26.29, cpi: 4.10, cape: 29.8 }
};

// VT：2008前用 MSCI World 代理，2008後為 VT 實際報酬；CPI 使用美國 CPI
const VT_DATA = {
  1966: { ret: -3.5, cpi: 3.01 }, 1967: { ret: 21.5, cpi: 2.78 }, 1968: { ret: 17.0, cpi: 4.27 }, 1969: { ret: -9.0, cpi: 5.46 }, 1970: { ret: 0.5, cpi: 5.92 },
  1971: { ret: 24.0, cpi: 4.30 }, 1972: { ret: 35.0, cpi: 3.27 }, 1973: { ret: -13.5, cpi: 6.22 }, 1974: { ret: -22.5, cpi: 11.04 }, 1975: { ret: 37.0, cpi: 9.14 },
  1976: { ret: 12.0, cpi: 5.74 }, 1977: { ret: 19.0, cpi: 6.50 }, 1978: { ret: 34.0, cpi: 7.62 }, 1979: { ret: 15.0, cpi: 11.25 }, 1980: { ret: 24.0, cpi: 13.58 },
  1981: { ret: -4.0, cpi: 10.33 }, 1982: { ret: 10.0, cpi: 6.13 }, 1983: { ret: 22.0, cpi: 3.21 }, 1984: { ret: 5.0, cpi: 4.30 }, 1985: { ret: 41.0, cpi: 3.55 },
  1986: { ret: 41.0, cpi: 1.91 }, 1987: { ret: 15.5, cpi: 3.66 }, 1988: { ret: 23.0, cpi: 4.08 }, 1989: { ret: 17.0, cpi: 4.83 }, 1990: { ret: -17.0, cpi: 5.40 },
  1991: { ret: 19.0, cpi: 4.23 }, 1992: { ret: -5.0, cpi: 3.03 }, 1993: { ret: 23.0, cpi: 2.95 }, 1994: { ret: 5.0, cpi: 2.61 }, 1995: { ret: 21.0, cpi: 2.81 },
  1996: { ret: 14.0, cpi: 2.93 }, 1997: { ret: 16.0, cpi: 2.34 }, 1998: { ret: 25.0, cpi: 1.55 }, 1999: { ret: 25.0, cpi: 2.19 }, 2000: { ret: -13.0, cpi: 3.38 },
  2001: { ret: -17.0, cpi: 2.83 }, 2002: { ret: -19.5, cpi: 1.59 }, 2003: { ret: 33.5, cpi: 2.27 }, 2004: { ret: 15.0, cpi: 2.68 }, 2005: { ret: 10.0, cpi: 3.39 },
  2006: { ret: 21.0, cpi: 3.23 }, 2007: { ret: 9.0, cpi: 2.85 }, 2008: { ret: -42.3, cpi: 3.85 }, 2009: { ret: 34.6, cpi: -0.34 }, 2010: { ret: 13.0, cpi: 1.64 },
  2011: { ret: -7.7, cpi: 3.16 }, 2012: { ret: 17.0, cpi: 2.07 }, 2013: { ret: 23.3, cpi: 1.46 }, 2014: { ret: 3.7, cpi: 1.62 }, 2015: { ret: -1.8, cpi: 0.12 },
  2016: { ret: 8.7, cpi: 1.26 }, 2017: { ret: 24.6, cpi: 2.13 }, 2018: { ret: -9.7, cpi: 2.44 }, 2019: { ret: 27.7, cpi: 1.81 }, 2020: { ret: 17.0, cpi: 1.23 },
  2021: { ret: 19.0, cpi: 4.70 }, 2022: { ret: -18.4, cpi: 8.00 }, 2023: { ret: 23.9, cpi: 4.10 }
};

// 0050：2003前用台灣加權指數代理，2003後為 0050 實際報酬；CPI 使用台灣 CPI
const TAIWAN_DATA = {
  1966: { ret: 10.0, cpi: 3.0 }, 1967: { ret: 15.0, cpi: 3.5 }, 1968: { ret: 20.0, cpi: 7.8 }, 1969: { ret: -5.0, cpi: 5.2 }, 1970: { ret: -8.0, cpi: 3.6 },
  1971: { ret: 32.0, cpi: 2.8 }, 1972: { ret: 48.0, cpi: 4.5 }, 1973: { ret: -38.0, cpi: 8.2 }, 1974: { ret: -20.0, cpi: 47.5 }, 1975: { ret: 55.0, cpi: 5.2 },
  1976: { ret: 28.0, cpi: 2.5 }, 1977: { ret: -12.0, cpi: 7.0 }, 1978: { ret: 22.0, cpi: 5.8 }, 1979: { ret: 12.0, cpi: 9.8 }, 1980: { ret: 28.0, cpi: 19.0 },
  1981: { ret: -18.0, cpi: 16.3 }, 1982: { ret: 7.0, cpi: 3.0 }, 1983: { ret: 32.0, cpi: 1.4 }, 1984: { ret: 8.0, cpi: 0.0 }, 1985: { ret: 5.0, cpi: -0.2 },
  1986: { ret: 90.0, cpi: 0.7 }, 1987: { ret: -19.0, cpi: 0.5 }, 1988: { ret: 119.0, cpi: 1.3 }, 1989: { ret: 85.0, cpi: 4.4 }, 1990: { ret: -53.0, cpi: 4.1 },
  1991: { ret: 6.5, cpi: 3.6 }, 1992: { ret: -25.0, cpi: 4.5 }, 1993: { ret: 79.0, cpi: 2.9 }, 1994: { ret: 17.0, cpi: 4.1 }, 1995: { ret: -27.0, cpi: 3.7 },
  1996: { ret: 34.0, cpi: 3.1 }, 1997: { ret: -2.5, cpi: 0.9 }, 1998: { ret: -22.0, cpi: 1.7 }, 1999: { ret: 31.0, cpi: 0.2 }, 2000: { ret: -44.0, cpi: 1.3 },
  2001: { ret: 17.0, cpi: 0.0 }, 2002: { ret: -20.0, cpi: -0.2 }, 2003: { ret: 32.5, cpi: -0.3 }, 2004: { ret: 4.0, cpi: 1.6 }, 2005: { ret: 7.2, cpi: 2.3 },
  2006: { ret: 19.7, cpi: 0.6 }, 2007: { ret: 9.5, cpi: 1.8 }, 2008: { ret: -46.0, cpi: 3.5 }, 2009: { ret: 78.0, cpi: -0.9 }, 2010: { ret: 10.5, cpi: 1.0 },
  2011: { ret: -21.5, cpi: 1.4 }, 2012: { ret: 12.0, cpi: 1.9 }, 2013: { ret: 11.8, cpi: 0.8 }, 2014: { ret: 8.9, cpi: 1.2 }, 2015: { ret: -7.1, cpi: -0.3 },
  2016: { ret: 14.1, cpi: 1.4 }, 2017: { ret: 15.6, cpi: 0.6 }, 2018: { ret: -9.1, cpi: 1.4 }, 2019: { ret: 33.0, cpi: 0.6 }, 2020: { ret: 22.4, cpi: -0.2 },
  2021: { ret: 22.9, cpi: 2.0 }, 2022: { ret: -22.6, cpi: 3.0 }, 2023: { ret: 26.3, cpi: 2.5 }
};

const ASSET_CONFIG = {
  SPY: { label: 'SPY', sublabel: 'S&P 500', color: '#6366f1', proxyNote: null },
  VT:  { label: 'VT',  sublabel: '全球股市', color: '#0891b2', proxyNote: '2008前採 MSCI World 代理' },
  '0050': { label: '0050', sublabel: '台灣50', color: '#059669', proxyNote: '2003前採台灣加權指數代理' },
};

const App = () => {
  const [mode, setMode] = useState('historical');
  const [startYear, setStartYear] = useState(1999);
  const [yearInputStr, setYearInputStr] = useState('1999');
  const [portfolioValue, setPortfolioValue] = useState(10000000);
  const [capeRatio, setCapeRatio] = useState(30);
  const [dividendYield, setDividendYield] = useState(3.0);
  const [interestRate, setInterestRate] = useState(2.5);
  const [retirementAge, setRetirementAge] = useState(50);
  const [deathAge, setDeathAge] = useState(79);
  const [maintenanceThreshold, setMaintenanceThreshold] = useState(300);
  const [maxDebtRatio, setMaxDebtRatio] = useState(25);
  const [theoreticalGrowth, setTheoreticalGrowth] = useState(5.0);
  const [calcVersion, setCalcVersion] = useState(0);
  const [capeCondition, setCapeCondition] = useState('none'); // 'none' | 'lt' | 'gt'
  const [capeConditionValue, setCapeConditionValue] = useState(25);
  const [assetType, setAssetType] = useState('SPY');
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [subEmail, setSubEmail] = useState('');
  const [subStatus, setSubStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'

  const handleYearInputChange = (val) => {
    setYearInputStr(val);
  };

  const handleYearInputCommit = () => {
    const parsed = parseInt(yearInputStr, 10);
    if (!isNaN(parsed)) {
      const y = Math.max(1966, Math.min(2023, parsed));
      setStartYear(y);
      setYearInputStr(String(y));
    } else {
      setYearInputStr(String(startYear));
    }
  };

  useEffect(() => {
    if (mode === 'historical' && HISTORICAL_DATA[startYear]) {
      setCapeRatio(HISTORICAL_DATA[startYear].cape);
    }
  }, [startYear, mode]);

  useEffect(() => {
    const seen = localStorage.getItem('safemax_subscribe_seen');
    if (!seen) {
      setShowSubscribe(true);
    }
  }, []);

  const handleCloseSubscribe = () => {
    setShowSubscribe(false);
    localStorage.setItem('safemax_subscribe_seen', '1');
  };

  const handleSubscribe = async () => {
    if (!subEmail || !subEmail.includes('@')) return;
    setSubStatus('loading');
    try {
      const res = await fetch('https://substackapi.com/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subEmail, domain: 'atticus.tw', publication_id: 3045941 }),
      });
      if (res.ok) {
        setSubStatus('success');
        setTimeout(() => handleCloseSubscribe(), 2000);
      } else {
        setSubStatus('error');
      }
    } catch {
      setSubStatus('error');
    }
  };

  const yearsToSimulate = useMemo(() => {
    const rAge = Number(retirementAge) || 0;
    const dAge = Number(deathAge) || 0;
    const years = dAge - rAge;
    return years > 0 ? years : 1;
  }, [deathAge, retirementAge]);

  const suggestedSWR = useMemo(() => {
    const cape = Number(capeRatio) || 0;
    if (cape > 30) return 4.7;   // 昂貴：防守模式
    if (cape > 15) return 5.2;   // 合理：標準模式 (5.0–5.5% 中間值)
    return 6.0;                   // 便宜：進攻模式
  }, [capeRatio]);

  const initialSpending = useMemo(() => {
    const pv = Number(portfolioValue) || 0;
    return (pv * suggestedSWR) / 100;
  }, [portfolioValue, suggestedSWR]);

  const simulationData = useMemo(() => {
    const pv = Number(portfolioValue) || 0;
    const rAge = Number(retirementAge) || 0;
    const dYield = Number(dividendYield) || 0;
    const iRate = Number(interestRate) || 0;
    const tGrowth = Number(theoreticalGrowth) || 0;
    const mThreshold = Number(maintenanceThreshold) || 300;
    const maxDebtRatioNum = maxDebtRatio === '' ? 25 : Number(maxDebtRatio);
    const maxDebt = pv * (maxDebtRatioNum / 100);

    let currentPortfolio = pv;
    let accumulatedDebt = 0;
    let currentSpending = initialSpending;
    let data = [];

    for (let i = 0; i <= yearsToSimulate; i++) {
      const yearLabel = startYear + i;
      const currentAge = rAge + i;

      const maintenanceRatio = accumulatedDebt === 0 ? Infinity : (currentPortfolio / accumulatedDebt) * 100;
      // CAPE 固定用美股 Shiller CAPE（所有資產的 SWR 參考基準）
      const currentCape = mode === 'historical' ? (HISTORICAL_DATA[yearLabel] || HISTORICAL_DATA[2023]).cape : capeRatio;
      const capeBlocked = capeCondition === 'lt' ? currentCape >= capeConditionValue
                        : capeCondition === 'gt' ? currentCape <= capeConditionValue
                        : false;
      const isGuardrailMode = maintenanceRatio < mThreshold || accumulatedDebt >= maxDebt || capeBlocked;
      const guardrailReason = capeBlocked ? "cape" : accumulatedDebt >= maxDebt ? "debt-cap" : maintenanceRatio < mThreshold ? "maintenance" : null;
      const strategy = isGuardrailMode ? "Sell Shares" : "Lending";

      const dividends = currentPortfolio * (dYield / 100);
      const interestExpense = accumulatedDebt * (iRate / 100);
      const netDividend = dividends - interestExpense;

      const hDataPoint = HISTORICAL_DATA[yearLabel];
      const capeVal = mode === 'historical' && hDataPoint ? hDataPoint.cape : null;
      const withdrawalPct = currentPortfolio > 0
        ? parseFloat(((currentSpending / currentPortfolio) * 100).toFixed(2))
        : null;

      data.push({
        year: mode === 'historical' ? yearLabel : i,
        age: currentAge,
        portfolio: Math.round(currentPortfolio),
        debt: Math.round(accumulatedDebt),
        netAssets: Math.round(currentPortfolio - accumulatedDebt),
        maintenance: maintenanceRatio === Infinity ? 5000 : Math.round(maintenanceRatio),
        spending: Math.round(currentSpending),
        strategy: strategy,
        guardrailReason: guardrailReason,
        cape: capeVal,
        withdrawalPct: withdrawalPct,
      });

      if (isGuardrailMode) {
        const requiredCash = currentSpending + (netDividend < 0 ? Math.abs(netDividend) : 0);
        const actualSellAmount = netDividend > 0 ? Math.max(0, currentSpending - netDividend) : requiredCash;
        currentPortfolio -= actualSellAmount;
      } else {
        accumulatedDebt += currentSpending;
        if (netDividend < 0) {
          accumulatedDebt += Math.abs(netDividend);
        }
      }

      let annualRet, annualInf;
      if (mode === 'historical') {
        const dataSource = assetType === 'VT' ? VT_DATA : assetType === '0050' ? TAIWAN_DATA : HISTORICAL_DATA;
        const fallback = assetType === 'VT' ? VT_DATA[2023] : assetType === '0050' ? TAIWAN_DATA[2023] : HISTORICAL_DATA[2023];
        const hData = dataSource[yearLabel] || fallback;
        annualRet = hData.ret;
        annualInf = hData.cpi;
      } else {
        annualRet = tGrowth;
        annualInf = 2.5;
      }

      currentPortfolio = currentPortfolio * (1 + annualRet / 100);

      // 動態提領：每年依當年 CAPE 重新計算 SWR
      const nextYearLabel = startYear + i + 1;
      const nextCape = mode === 'historical'
        ? (HISTORICAL_DATA[nextYearLabel] || HISTORICAL_DATA[2023]).cape
        : capeRatio;
      const nextSWR = nextCape > 30 ? 4.7 : nextCape > 15 ? 5.2 : 6.0;
      currentSpending = currentPortfolio * (nextSWR / 100);

      if (currentPortfolio <= 0) {
        currentPortfolio = 0;
        break;
      }
    }
    return data;
  }, [mode, startYear, portfolioValue, initialSpending, suggestedSWR, dividendYield, interestRate, yearsToSimulate, theoreticalGrowth, retirementAge, maintenanceThreshold, maxDebtRatio, calcVersion, capeCondition, capeConditionValue, capeRatio, assetType]);

  const latestData = simulationData[simulationData.length - 1];

  const lendingYears = simulationData.filter(d => d.strategy === 'Lending').map(d => d.year);
  const sellYears = simulationData.filter(d => d.strategy === 'Sell Shares').map(d => d.year);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 text-slate-900">

      {/* 訂閱電子報 Popup */}
      {showSubscribe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)'}}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
            <button onClick={handleCloseSubscribe} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center mb-6">
              <img src="/opup-hero.jpg" alt="顯二的長效價值" className="w-full rounded-xl mb-4 object-cover max-h-48" />
              <h2 className="text-xl font-black text-slate-800 mb-1">顯二的長效價值</h2>
              <p className="text-sm text-slate-400 font-medium">拉長人生的槓桿</p>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-6 text-center">
              謝謝你從顯二的電子報或者是臉書來到這個退休金回測網站！歡迎訂閱我的電子報，投資、讀書心得以及趨勢科技都會在這裡分享喔！
            </p>

            {subStatus === 'success' ? (
              <div className="bg-emerald-50 text-emerald-700 font-bold text-center py-4 rounded-xl">
                🎉 訂閱成功！感謝你的支持！
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="輸入你的 Email..."
                    value={subEmail}
                    onChange={(e) => setSubEmail(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSubscribe(); }}
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleSubscribe}
                    disabled={subStatus === 'loading'}
                    className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-60"
                  >
                    {subStatus === 'loading' ? '...' : '訂閱'}
                  </button>
                </div>
                {subStatus === 'error' && (
                  <p className="text-rose-500 text-xs mt-2 text-center">訂閱失敗，請直接前往 <a href="https://atticus.tw/subscribe" target="_blank" className="underline">atticus.tw/subscribe</a> 訂閱</p>
                )}
                <p className="text-[10px] text-slate-400 text-center mt-3">Over 1,000 subscribers · 隨時可取消訂閱</p>
              </>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">

        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
              <ShieldCheck className="text-indigo-600" size={36} />
              SAFEMAX 2026 護欄策略回測
            </h1>
            <p className="text-slate-500 font-medium">動態質押 vs 變賣模式自動切換</p>
          </div>

          <div className="flex bg-white p-1 rounded-xl shadow-inner border border-slate-200">
            <button onClick={() => setMode('historical')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${mode === 'historical' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
              <History size={16} /> 歷史模式回測
            </button>
            <button onClick={() => setMode('theoretical')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${mode === 'theoretical' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
              <Zap size={16} /> 理論情境模擬
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <aside className="lg:col-span-4 space-y-6">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-indigo-900">
                <Calculator size={20} /> 戰略控制台
              </h3>

              <div className="space-y-6">
                {/* 資產選擇 */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 uppercase">回測指數</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(ASSET_CONFIG).map(([key, cfg]) => (
                      <button
                        key={key}
                        onClick={() => setAssetType(key)}
                        className={`py-2 rounded-xl text-xs font-black border-2 transition-all ${assetType === key ? 'text-white shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
                        style={assetType === key ? { backgroundColor: cfg.color, borderColor: cfg.color } : {}}
                      >
                        <div>{cfg.label}</div>
                        <div className="font-medium opacity-80">{cfg.sublabel}</div>
                      </button>
                    ))}
                  </div>
                  {ASSET_CONFIG[assetType].proxyNote && (
                    <p className="text-[10px] text-slate-400 italic">⚠ {ASSET_CONFIG[assetType].proxyNote}</p>
                  )}
                </div>

                <InputGroup
                  label="初始資產總額 (TWD)"
                  value={portfolioValue}
                  onChange={setPortfolioValue}
                  step={1000000}
                  type="number"
                  icon={<DollarSign size={16}/>}
                />

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">退休年齡</label>
                      <input
                        type="number"
                        value={retirementAge}
                        onChange={(e) => setRetirementAge(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">預期壽命</label>
                      <input
                        type="number"
                        value={deathAge}
                        onChange={(e) => setDeathAge(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                   </div>
                </div>

                <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1">
                     <AlertTriangle size={12} className="text-amber-500" /> 安全維持率門檻 (%)
                   </label>
                   <input
                      type="number"
                      value={maintenanceThreshold}
                      onChange={(e) => setMaintenanceThreshold(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full p-2 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg font-black focus:ring-2 focus:ring-amber-500 outline-none"
                   />
                   <p className="text-[10px] text-slate-400 italic">當維持率低於此數值，將停止借款改為賣股。</p>
                </div>

                <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1">
                     <Lock size={12} className="text-rose-500" /> 累積借款上限 (初始資產 %)
                   </label>
                   <input
                      type="number"
                      value={maxDebtRatio}
                      onChange={(e) => setMaxDebtRatio(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full p-2 bg-rose-50 border border-rose-200 text-rose-900 rounded-lg font-black focus:ring-2 focus:ring-rose-500 outline-none"
                   />
                   <p className="text-[10px] text-slate-400 italic">
                     上限 = ${((Number(portfolioValue)||0) * (Number(maxDebtRatio)||25) / 100).toLocaleString()}｜超過後轉賣股，回落後恢復質押。
                   </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1">
                    <AlertTriangle size={12} className="text-orange-400" /> 質押 CAPE 條件
                  </label>
                  <div className="flex gap-2">
                    {[
                      { val: 'none', label: '不限' },
                      { val: 'lt',   label: 'CAPE <' },
                      { val: 'gt',   label: 'CAPE >' },
                    ].map(opt => (
                      <button
                        key={opt.val}
                        onClick={() => setCapeCondition(opt.val)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${capeCondition === opt.val ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-slate-500 border-slate-200 hover:border-orange-300'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {capeCondition !== 'none' && (
                    <input
                      type="number"
                      value={capeConditionValue}
                      onChange={(e) => setCapeConditionValue(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full p-2 bg-orange-50 border border-orange-200 text-orange-900 rounded-lg font-black focus:ring-2 focus:ring-orange-400 outline-none text-center"
                    />
                  )}
                  <p className="text-[10px] text-slate-400 italic">
                    {capeCondition === 'none' ? '無論 CAPE 高低均可質押。' : capeCondition === 'lt' ? `僅當 CAPE < ${capeConditionValue} 時才質押（市場合理/低估時借款）。` : `僅當 CAPE > ${capeConditionValue} 時才質押。`}
                  </p>
                </div>

                {mode === 'historical' ? (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
                      <Calendar size={16} /> 選擇歷史起點 (1966-2023)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={yearInputStr}
                      onChange={(e) => handleYearInputChange(e.target.value)}
                      onBlur={handleYearInputCommit}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.target.blur(); } }}
                      className="w-full p-3 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-xl font-bold text-center outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                ) : (
                  <SliderGroup label="預期增長" value={theoreticalGrowth} min={-2} max={10} step={0.5} onChange={setTheoreticalGrowth} suffix="%" />
                )}

                <div className="grid grid-cols-2 gap-4">
                  <SliderGroup label="股息率" value={dividendYield} min={0} max={8} step={0.1} onChange={setDividendYield} suffix="%" />
                  <SliderGroup label="質押利率" value={interestRate} min={1} max={8} step={0.1} onChange={setInterestRate} suffix="%" />
                </div>

                <button
                  onClick={() => setCalcVersion(v => v + 1)}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Zap size={16} /> 開始計算
                </button>
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4 text-sm text-slate-600">
              <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                <Info size={16} className="text-indigo-500" /> 策略說明
              </h3>

              <div className="space-y-1">
                <p className="font-bold text-slate-700">📌 核心底層：SAFEMAX 4.7%</p>
                <p>根據 Bill Bengen 2025 研究，4.7% 是通過百年壓力測試（含大蕭條、惡性通膨）的安全最大提領率地板。本策略以此為基礎，每年依<span className="font-bold text-orange-500">當年 CAPE</span>動態重算支出，市場漲多花多、市場跌自動縮減，切斷熊市持續失血的惡性循環。</p>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-slate-700">💡 動態提領率（每年重算）</p>
                <p className="text-xs text-slate-400 mb-1">當年支出 = 當年市值 × CAPE 對應 SWR</p>
                <ul className="text-xs text-slate-500 pl-3 space-y-0.5 list-disc list-inside">
                  <li>CAPE &gt; 30（昂貴）→ <span className="font-bold text-rose-500">4.7%</span> 防守</li>
                  <li>CAPE 15–30（合理）→ <span className="font-bold text-amber-500">5.2%</span> 標準</li>
                  <li>CAPE ≤ 15（便宜）→ <span className="font-bold text-emerald-600">6.0%</span> 進攻</li>
                </ul>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-slate-700">🏦 質押借款取代賣股</p>
                <p>退休後以 ETF（0050/006208）向券商質押借款支應生活費，確保股數不減少，完整享受複利與除權息。股息收益率需大於質押利率，利息自動清償不滾雪球。</p>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-slate-700">🛡 雙重護欄（任一觸發切換賣股）</p>
                <ul className="text-xs text-slate-500 pl-3 space-y-0.5 list-disc list-inside">
                  <li><span className="font-bold">維持率護欄：</span>市值 / 借款 &lt; 300%</li>
                  <li><span className="font-bold">債務天花板：</span>借款 ≥ 初始資產 × 25%</li>
                </ul>
                <p className="text-xs text-slate-400 mt-1">賣股時先用股息抵利息，剩餘缺口才賣股。護欄解除後自動恢復質押。</p>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-slate-700">⚙️ 操作步驟</p>
                <ol className="text-xs text-slate-500 pl-3 space-y-0.5 list-decimal list-inside">
                  <li>填入初始資產、退休年齡、預期壽命</li>
                  <li>調整股息率與質押利率</li>
                  <li>設定維持率門檻與借款上限 %</li>
                  <li>選歷史起點（或理論模式）</li>
                  <li>點「開始計算」查看結果</li>
                </ol>
              </div>
            </section>
          </aside>

          <main className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard title="終局淨資產" value={`$${latestData.netAssets.toLocaleString()}`} color={latestData.netAssets < 0 ? "text-rose-600" : "text-emerald-600"} />
              <StatCard title="終局資產市值" value={`$${latestData.portfolio.toLocaleString()}`} color="text-indigo-600" />
              <StatCard title="終局累積債務" value={`$${latestData.debt.toLocaleString()}`} color={latestData.debt > 0 ? "text-rose-500" : "text-slate-400"} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">護欄模式觸發狀態</p>
                <div className="flex items-center gap-2 mt-2">
                   {simulationData.some(d => d.strategy === "Sell Shares") ? (
                      <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                        <ArrowRightLeft size={14} /> 已啟動賣股避險
                      </span>
                   ) : (
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                        <ShieldCheck size={14} /> 全程質押穩定
                      </span>
                   )}
                </div>
              </div>
              <StatCard title="終局維持率" value={latestData.maintenance === 5000 ? "∞" : `${latestData.maintenance}%`} color={latestData.maintenance < Number(maintenanceThreshold) ? "text-rose-600" : "text-indigo-600"} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-indigo-100">
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">質押年度</p>
                <h4 className="text-2xl font-black text-indigo-600 mt-1">{lendingYears.length} 年</h4>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed break-words">
                  {lendingYears.length > 0 ? lendingYears.join('、') : '無'}
                </p>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-amber-100">
                <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">賣股年度</p>
                <h4 className="text-2xl font-black text-amber-600 mt-1">{sellYears.length} 年</h4>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed break-words">
                  {sellYears.length > 0 ? sellYears.join('、') : '無'}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold mb-6 flex items-center justify-between">
                <span>資產成長趨勢 (含策略切換點)</span>
                <div className="flex gap-4">
                   <div className="flex items-center gap-1 text-xs text-indigo-600 font-bold"><div className="w-3 h-3 bg-indigo-600 rounded-full"></div> 市值</div>
                   <div className="flex items-center gap-1 text-xs text-rose-500 font-bold"><div className="w-3 h-3 bg-rose-500 rounded-full"></div> 負債</div>
                </div>
              </h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={simulationData}>
                    <defs>
                      <linearGradient id="colorPort" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="age" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/10000).toFixed(0)}萬`} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const d = payload[0].payload;
                          return (
                            <div className="bg-white p-4 rounded-xl shadow-xl border border-slate-100">
                              <p className="font-black text-slate-800 border-b pb-2 mb-2">{label} 歲 ({d.year}年)</p>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between gap-4"><span>策略模式：</span><span className={`font-bold ${d.strategy === 'Sell Shares' ? 'text-amber-600' : 'text-indigo-600'}`}>{d.strategy === 'Sell Shares' ? `變賣模式（${d.guardrailReason === 'debt-cap' ? '借款上限' : d.guardrailReason === 'cape' ? 'CAPE條件' : '維持率'}）` : '質押模式'}</span></div>
                                <div className="flex justify-between gap-4"><span>股票市值：</span><span className="font-bold">${d.portfolio.toLocaleString()}</span></div>
                                <div className="flex justify-between gap-4"><span>累積負債：</span><span className="font-bold text-rose-500">${d.debt.toLocaleString()}</span></div>
                                <div className="flex justify-between gap-4 border-t pt-2"><span>淨資產：</span><span className="font-bold text-emerald-600">${d.netAssets.toLocaleString()}</span></div>
                                {d.cape != null && <div className="flex justify-between gap-4"><span>CAPE：</span><span className="font-bold text-orange-500">{d.cape}</span></div>}
                                {d.withdrawalPct != null && <div className="flex justify-between gap-4"><span>提領率：</span><span className="font-bold text-teal-600">{d.withdrawalPct}%</span></div>}
                                {d.spending != null && <div className="flex justify-between gap-4"><span>提領金額：</span><span className="font-bold text-teal-700">${d.spending.toLocaleString()}</span></div>}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area type="monotone" dataKey="portfolio" name="股票市值" stroke="#6366f1" strokeWidth={3} fill="url(#colorPort)" />
                    <Area type="monotone" dataKey="debt" name="累積負債" stroke="#f43f5e" strokeWidth={3} fillOpacity={0.1} fill="#f43f5e" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {mode === 'historical' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold mb-1">每年 CAPE 與實際提領率</h3>
                <p className="text-xs text-slate-400 mb-5">提領率 = 當年支出 ÷ 股票市值（質押或賣股均計入）</p>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={simulationData} margin={{ right: 24 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} />
                      <YAxis yAxisId="left" axisLine={false} tickLine={false} domain={[0, 60]} tickFormatter={(v) => `${v}`} label={{ value: 'CAPE', angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: '#94a3b8' } }} />
                      <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} domain={[0, 12]} tickFormatter={(v) => `${v}%`} label={{ value: '提領率', angle: 90, position: 'insideRight', style: { fontSize: 10, fill: '#94a3b8' } }} />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const d = payload[0]?.payload;
                            return (
                              <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100 text-sm">
                                <p className="font-black text-slate-800 border-b pb-1 mb-2">{label} 年</p>
                                <div className="flex justify-between gap-4"><span className="text-orange-500">CAPE：</span><span className="font-bold">{d?.cape ?? '—'}</span></div>
                                <div className="flex justify-between gap-4"><span className="text-teal-600">提領率：</span><span className="font-bold">{d?.withdrawalPct != null ? `${d.withdrawalPct}%` : '—'}</span></div>
                                <div className="flex justify-between gap-4"><span className="text-teal-700">提領金額：</span><span className="font-bold">{d?.spending != null ? `$${d.spending.toLocaleString()}` : '—'}</span></div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line yAxisId="left" type="monotone" dataKey="cape" name="CAPE" stroke="#f97316" strokeWidth={2} dot={false} />
                      <Line yAxisId="right" type="monotone" dataKey="withdrawalPct" name="提領率 (%)" stroke="#14b8a6" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-6 mt-3 justify-center text-xs font-bold">
                  <span className="flex items-center gap-1 text-orange-500"><span className="inline-block w-4 h-0.5 bg-orange-500"></span> CAPE (左軸)</span>
                  <span className="flex items-center gap-1 text-teal-600"><span className="inline-block w-4 h-0.5 bg-teal-500"></span> 提領率 % (右軸)</span>
                </div>
              </div>
            )}

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold mb-6 text-center">維持率防線與門檻切換</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={simulationData.slice(1)}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="age" />
                    <YAxis domain={[0, 1500]} />
                    <Tooltip />
                    <ReferenceLine y={Number(maintenanceThreshold)} stroke="#f59e0b" strokeDasharray="8 8" label={{ position: 'right', value: '護欄門檻', fill: '#d97706', fontSize: 10 }} />
                    <ReferenceLine y={140} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'right', value: '斷頭線', fill: '#b91c1c', fontSize: 10 }} />
                    <Line type="stepAfter" dataKey="maintenance" name="維持率 (%)" stroke="#8b5cf6" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 bg-slate-50 rounded-xl text-[10px] text-slate-500 italic">
                *當紫色線條跌破橘色虛線時，系統將自動停止增加債務，改為變賣股票以支付生活費及利息。
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, desc, color = "text-slate-800" }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
    <h4 className={`text-2xl font-black mt-1 ${color}`}>{value}</h4>
    <p className="text-xs text-slate-500 mt-1">{desc}</p>
  </div>
);

const InputGroup = ({ label, value, onChange, step, type, icon }) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-slate-600">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        step={step}
        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold transition-all outline-none"
      />
    </div>
  </div>
);

const SliderGroup = ({ label, value, min, max, step = 1, onChange, suffix = "" }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{label}</label>
      <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{value}{suffix}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
  </div>
);

export default App;
