import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import {
  BuildingStorefrontIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  ArrowTrendingUpIcon,
  ArrowPathIcon,
  FunnelIcon,
  CalendarIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  DocumentArrowDownIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  SparklesIcon,
  CheckBadgeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {
  FaExclamationTriangle,
  FaStar,
  FaStoreSlash,
  FaChartBar,
  FaSortAmountUp,
  FaSortAmountDown,
  FaCoffee,
  FaMedal,
  FaUserCheck,
  FaUserTimes,
  FaCalendarCheck,
  FaShieldAlt,
  FaTasks,
  FaRoute,
  FaLightbulb,
  FaDownload,
} from 'react-icons/fa';
import { getDashboardAdmin, getDashboardAuditor } from '../API/dashboard';
import { useAuth } from '../context/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';
import ContentLoader from 'react-content-loader';
import dayjs from 'dayjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Active Navigation Tab: 'overview' | 'quality' | 'compliance' | 'routes' | 'workforce' | 'complaints'
  const [activeTab, setActiveTab] = useState('overview');

  // Filter States
  const [dateRange, setDateRange] = useState('month'); // 'today' | 'week' | 'month' | '30d'
  const [selectedRoute, setSelectedRoute] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter within Tab
  const [auditSearchQuery, setAuditSearchQuery] = useState('');

  // Core Metrics
  const [shopCount, setShopCount] = useState(0);
  const [auditorsCount, setAuditorsCount] = useState(0);
  const [routesCount, setRoutesCount] = useState(0);
  const [routesList, setRoutesList] = useState([]);
  const [auditsCount, setAuditsCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [pendingApprovalCount, setPendingApprovalCount] = useState(0);

  // Quality & V2 Audit Analytics
  const [avgScore, setAvgScore] = useState(0);
  const [avgPercentage, setAvgPercentage] = useState(0);
  const [passRate, setPassRate] = useState(0);
  const [passCount, setPassCount] = useState(0);
  const [criticalRiskRate, setCriticalRiskRate] = useState(0);
  const [criticalRiskCount, setCriticalRiskCount] = useState(0);
  const [coverageRate, setCoverageRate] = useState(0);
  const [uniqueShopsAudited, setUniqueShopsAudited] = useState(0);
  const [avgDurationMinutes, setAvgDurationMinutes] = useState(0);
  const [signatures, setSignatures] = useState({ owner: 0, employee: 0 });
  const [healthSegments, setHealthSegments] = useState({ pinnacle: 0, healthy: 0, watchlist: 0, critical: 0 });
  const [fssaiBreakdown, setFssaiBreakdown] = useState({ expired: 0, urgent15d: 0, warning30d: 0 });
  const [pmInsights, setPmInsights] = useState([]);
  const [isFeedClosed, setIsFeedClosed] = useState(false);
  const [dismissedInsightIds, setDismissedInsightIds] = useState([]);

  const visibleInsights = useMemo(() => {
    return pmInsights.filter((insight) => !dismissedInsightIds.includes(insight.id));
  }, [pmInsights, dismissedInsightIds]);

  const [gradeDistribution, setGradeDistribution] = useState({ 'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0 });
  const [sectionPerformance, setSectionPerformance] = useState([]);
  const [auditTrend, setAuditTrend] = useState([]);
  const [recentAudits, setRecentAudits] = useState([]);

  // Shop Rankings & Alerts
  const [topShops, setTopShops] = useState([]);
  const [leastShops, setLeastShops] = useState([]);
  const [auditorPerformance, setAuditorPerformance] = useState([]);
  const [expiredOutlets, setExpiredOutlets] = useState([]);
  const [fssaiAlerts, setFssaiAlerts] = useState([]);
  const [commercialAlerts, setCommercialAlerts] = useState([]);
  const [expiredModal, setExpiredModal] = useState({ isOpen: false, shopData: null });

  // Workforce & Attendance
  const [attendanceSummary, setAttendanceSummary] = useState({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    onLeaveToday: 0,
    attendanceRate: 0,
    todayAttendanceList: []
  });

  // Complaints & SLA
  const [complaintsSummary, setComplaintsSummary] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    overdue: 0,
    capaCompleted: 0,
    resolutionRate: 0,
    recentComplaints: []
  });

  // Fetch Dashboard Data
  const fetchDashboardData = useCallback(async (range = dateRange, routeId = selectedRoute) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const params = {
        range,
        ...(routeId ? { routeId } : {})
      };
      const response =
        user.role === 'super-admin'
          ? await getDashboardAdmin(params)
          : await getDashboardAuditor(user._id, params);

      if (response && response.data) {
        const d = response.data;
        setRoutesCount(d.routesCount || 0);
        setRoutesList(d.routesList || []);
        setAuditorsCount(d.auditorsCount || 0);
        setShopCount(d.shopsCount || 0);
        setAuditsCount(d.totalAudits || 0);
        setPendingCount(d.pendingAudit || 0);
        setCompletedCount(d.completedAudits || 0);
        setInProgressCount(d.inProgressAudits || 0);
        setPendingApprovalCount(d.pendingApprovalAudits || 0);

        setTopShops(d.topRatedShops || []);
        setLeastShops(d.leastRatedShops || []);
        setAuditorPerformance(d.auditorPerformance || []);
        setExpiredOutlets(d.expiredProductsOutlets || []);
        setFssaiAlerts(d.fssaiAlerts || []);
        setCommercialAlerts(d.commercialAlerts || []);
        setFssaiBreakdown(d.fssaiBreakdown || { expired: 0, urgent15d: 0, warning30d: 0 });

        setAvgScore(d.avgScore || 0);
        setAvgPercentage(d.avgPercentage || 0);
        setPassRate(d.passRate || 0);
        setPassCount(d.passCount || 0);
        setCriticalRiskRate(d.criticalRiskRate || 0);
        setCriticalRiskCount(d.criticalRiskCount || 0);
        setCoverageRate(d.coverageRate || 0);
        setUniqueShopsAudited(d.uniqueShopsAudited || 0);
        setAvgDurationMinutes(d.avgDurationMinutes || 0);
        setSignatures(d.signatures || { owner: 0, employee: 0 });
        setHealthSegments(d.healthSegments || { pinnacle: 0, healthy: 0, watchlist: 0, critical: 0 });
        setPmInsights(d.pmInsights || []);

        setGradeDistribution(d.gradeDistribution || { 'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0 });
        setSectionPerformance(d.sectionPerformance || []);
        setAuditTrend(d.auditTrend || []);
        setRecentAudits(d.recentAudits || []);

        if (d.attendanceSummary) setAttendanceSummary(d.attendanceSummary);
        if (d.complaintsSummary) setComplaintsSummary(d.complaintsSummary);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user, dateRange, selectedRoute]);

  useEffect(() => {
    fetchDashboardData(dateRange, selectedRoute);
  }, [fetchDashboardData, dateRange, selectedRoute]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDashboardData(dateRange, selectedRoute);
  };

  const getDaysLeft = (dateStr) => {
    if (!dateStr) return null;
    return dayjs(dateStr).diff(dayjs(), 'day');
  };

  const visibleFssai = useMemo(() => {
    return [...fssaiAlerts].sort((a, b) => new Date(a.fssiRenewalDate) - new Date(b.fssiRenewalDate));
  }, [fssaiAlerts]);

  const visibleCommercial = useMemo(() => {
    return [...commercialAlerts].sort((a, b) => new Date(a.renewalDate) - new Date(b.renewalDate));
  }, [commercialAlerts]);

  const totalUrgentAlerts =
    fssaiBreakdown.expired +
    fssaiBreakdown.urgent15d +
    expiredOutlets.length +
    (complaintsSummary.overdue || 0);

  // Filtered recent audits for Tab 2
  const filteredRecentAudits = useMemo(() => {
    if (!auditSearchQuery.trim()) return recentAudits;
    const q = auditSearchQuery.toLowerCase();
    return recentAudits.filter(
      (a) =>
        (a.shop?.shopName || '').toLowerCase().includes(q) ||
        (a.auditor?.name || '').toLowerCase().includes(q) ||
        (a.overallGrade || '').toLowerCase().includes(q)
    );
  }, [recentAudits, auditSearchQuery]);

  // Export Executive Brief CSV
  const handleExportReportCSV = () => {
    const rows = [
      ['CHITRA COFFEE BAR - EXECUTIVE OPERATIONS BRIEF'],
      [`Generated On`, dayjs().format('YYYY-MM-DD HH:mm:ss')],
      [`Selected Range`, dateRange.toUpperCase()],
      [`Selected Route`, selectedRoute ? (routesList.find(r => r._id === selectedRoute)?.name || selectedRoute) : 'All Routes'],
      [''],
      ['KEY OPERATIONAL METRICS', 'VALUE', 'BENCHMARK / TARGET'],
      ['Total Network Outlets', shopCount, '—'],
      ['Unique Outlets Audited', uniqueShopsAudited, '—'],
      ['Cycle Network Coverage', `${coverageRate}%`, '90% Target'],
      ['Total Completed Audits', completedCount, '—'],
      ['Average Quality Score', `${avgScore} / 5 (${avgPercentage}%)`, '4.2 / 5 (84%)'],
      ['Audit Pass Rate (A+ & A)', `${passRate}% (${passCount} audits)`, '85% Target'],
      ['Critical Risk Rate (C & D)', `${criticalRiskRate}% (${criticalRiskCount} audits)`, '< 5% Max'],
      ['Average Audit Duration', `${avgDurationMinutes} mins`, '45 mins SLA'],
      ['Auditors Present Today', `${attendanceSummary.presentToday} / ${attendanceSummary.totalEmployees}`, '90% Target'],
      ['Overdue Complaints SLA', complaintsSummary.overdue || 0, '0 Tolerance'],
      ['Expired Inventory Outlets', expiredOutlets.length, '0 Tolerance'],
      ['Lapsed FSSAI Licenses', fssaiBreakdown.expired, '0 Tolerance'],
      [''],
      ['SECTION-WISE QUALITY COMPLIANCE'],
      ['Section Name', 'Average Compliance %', 'Status'],
      ...sectionPerformance.map((s) => [
        s.sectionName,
        `${s.avgPercentage}%`,
        s.avgPercentage >= 80 ? 'Healthy' : s.avgPercentage >= 65 ? 'Moderate' : 'Critical'
      ]),
      [''],
      ['ROUTE-WISE COVERAGE SNAPSHOT'],
      ['Route Name', 'Total Shops', 'Audited Shops', 'Coverage %'],
      ...routesList.map((r) => [
        r.name,
        r.shopsCount,
        r.auditedCount || 0,
        `${r.coverageRate || 0}%`
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CCB_Executive_Brief_${dateRange}_${dayjs().format('YYYYMMDD')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const SkeletonCard = () => (
    <ContentLoader
      speed={2}
      width="100%"
      height={90}
      viewBox="0 0 400 90"
      backgroundColor="#f3f4f6"
      foregroundColor="#e5e7eb"
      className="p-3 rounded-lg shadow-xs border border-slate-100 bg-white"
    >
      <rect x="15" y="15" rx="6" ry="6" width="35" height="35" />
      <rect x="65" y="18" rx="4" ry="4" width="150" height="14" />
      <rect x="65" y="40" rx="4" ry="4" width="90" height="10" />
    </ContentLoader>
  );

  return (
    <div className="min-h-screen poppins-regular text-slate-700 text-xs pb-10">
      
      {/* ── Top Header & Global PM Controls ── */}
      <div className="mb-4 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 bg-white p-3.5 rounded-lg border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-red-600">Operations Intelligence Cockpit</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-[9px] font-medium text-slate-500 border border-slate-200">
              V2 Quality System
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-800 tracking-tight mt-0.5">
            Chitra Coffee Bar Operations
          </h1>
          <p className="text-[11px] text-slate-400 mt-0.5 font-normal">
            Network quality governance, hygiene benchmark, franchise risk mitigation, and SLA tracking.
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Route Filter Dropdown */}
          <div className="flex items-center bg-slate-100 rounded-md px-2.5 py-1.5 border border-slate-200 text-xs font-normal">
            <MapPinIcon className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
            <select
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
              className="bg-transparent text-slate-700 outline-none cursor-pointer pr-1 font-medium text-xs"
            >
              <option value="">All Field Routes ({routesList.length})</option>
              {routesList.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.name} ({r.shopsCount} outlets • {r.coverageRate || 0}%)
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Selector Pills */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200 text-xs font-normal">
            {[
              { id: 'today', label: 'Today' },
              { id: 'week', label: '7 Days' },
              { id: 'month', label: 'This Month' },
              { id: '30d', label: '30 Days' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setDateRange(p.id)}
                className={`px-2.5 py-1 rounded transition-all text-xs ${
                  dateRange === p.id
                    ? 'bg-red-600 text-white shadow-xs font-medium'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Restore / Toggle Feed if closed or partially dismissed */}
          {(isFeedClosed || dismissedInsightIds.length > 0) && pmInsights.length > 0 && (
            <button
              onClick={() => {
                setIsFeedClosed(false);
                setDismissedInsightIds([]);
              }}
              title="Show Actionable Operations Intelligence Feed"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-red-600 transition-colors shadow-xs text-xs font-medium"
            >
              <SparklesIcon className="w-3.5 h-3.5 text-red-600" />
              <span className="hidden sm:inline">Show Insights</span>
              <span className="text-[10px] font-medium bg-red-50 text-red-700 px-1.5 py-0.2 rounded-full border border-red-100">
                {pmInsights.length}
              </span>
            </button>
          )}

          {/* Export Executive Brief CSV Button */}
          <button
            onClick={handleExportReportCSV}
            title="Export Executive Operations Brief (CSV)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium transition-colors shadow-xs"
          >
            <ArrowDownTrayIcon className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Export Brief</span>
          </button>

          {/* Quick Refresh */}
          <button
            onClick={handleRefresh}
            title="Refresh Data"
            className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-red-600 transition-colors bg-white shadow-xs"
          >
            <ArrowPathIcon className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-red-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── Smart Automated Product Manager Insights Ribbon ── */}
      {!isFeedClosed && visibleInsights.length > 0 && (
        <div className="mb-4 bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs relative">
          <div className="flex items-center justify-between mb-2.5 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="p-1 rounded bg-red-50 text-red-600">
                <SparklesIcon className="w-3.5 h-3.5" />
              </span>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
                Actionable Operations Intelligence Feed
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-red-700 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                {visibleInsights.length} Recommendations
              </span>
              <button
                type="button"
                onClick={() => setIsFeedClosed(true)}
                title="Dismiss Intelligence Feed"
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close feed"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {visibleInsights.map((insight) => {
              const isCrit = insight.severity === 'critical';
              const isWarn = insight.severity === 'warning';
              const isPos = insight.severity === 'positive';

              const cardStyle = isCrit
                ? 'bg-rose-50/40 border-rose-200/80 hover:bg-rose-50/70 hover:border-rose-300'
                : isWarn
                ? 'bg-amber-50/40 border-amber-200/80 hover:bg-amber-50/70 hover:border-amber-300'
                : isPos
                ? 'bg-emerald-50/40 border-emerald-200/80 hover:bg-emerald-50/70 hover:border-emerald-300'
                : 'bg-blue-50/40 border-blue-200/80 hover:bg-blue-50/70 hover:border-blue-300';

              const badgeStyle = isCrit
                ? 'bg-rose-100 text-rose-800 border border-rose-200/70'
                : isWarn
                ? 'bg-amber-100 text-amber-800 border border-amber-200/70'
                : isPos
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/70'
                : 'bg-blue-100 text-blue-800 border border-blue-200/70';

              const p1BadgeStyle = isCrit
                ? 'text-rose-600 border-rose-200/60 bg-white/90'
                : isWarn
                ? 'text-amber-700 border-amber-200/60 bg-white/90'
                : isPos
                ? 'text-emerald-700 border-emerald-200/60 bg-white/90'
                : 'text-blue-700 border-blue-200/60 bg-white/90';

              const footerDividerStyle = isCrit
                ? 'border-rose-100'
                : isWarn
                ? 'border-amber-100'
                : isPos
                ? 'border-emerald-100'
                : 'border-blue-100';

              const actionStyle = isCrit
                ? 'text-red-600 hover:text-red-700'
                : isWarn
                ? 'text-amber-700 hover:text-amber-800'
                : isPos
                ? 'text-emerald-700 hover:text-emerald-800'
                : 'text-blue-600 hover:text-blue-700';

              return (
                <div
                  key={insight.id}
                  onClick={() => {
                    if (insight.targetTab) setActiveTab(insight.targetTab);
                  }}
                  className={`p-3 rounded-lg border transition-all flex flex-col justify-between shadow-xs hover:shadow-sm cursor-pointer group ${cardStyle}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1.5">
                      <span className={`text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded ${badgeStyle}`}>
                        {insight.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className={`text-[9px] font-mono font-medium px-1.5 py-0.2 rounded border ${p1BadgeStyle}`}>
                          P1
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDismissedInsightIds((prev) => [...prev, insight.id]);
                          }}
                          title="Dismiss recommendation"
                          className="text-slate-400 hover:text-slate-700 p-0.5 rounded hover:bg-black/5 transition-colors"
                        >
                          <XMarkIcon className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-[11px] font-semibold text-slate-800 mt-1.5 leading-snug">
                      {insight.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed font-normal">
                      {insight.description}
                    </p>
                  </div>

                  <div className={`mt-2.5 pt-2 border-t flex items-center justify-between ${footerDividerStyle}`}>
                    <span className="text-[9px] font-medium text-slate-400">Impact: High</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (insight.targetTab) setActiveTab(insight.targetTab);
                      }}
                      className={`text-[10px] font-semibold flex items-center gap-0.5 transition-colors ${actionStyle}`}
                    >
                      {insight.actionText}
                      <ChevronRightIcon className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Multi-Domain Navigation Tabs ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-4 border-b border-slate-200 custom-scrollbar">
        {[
          { id: 'overview', label: 'Executive Overview', icon: FaChartBar },
          { id: 'quality', label: 'Audits & Quality (V2)', icon: FaCoffee },
          {
            id: 'compliance',
            label: 'Shop Compliance & Risks',
            icon: FaShieldAlt,
            badge: totalUrgentAlerts > 0 ? totalUrgentAlerts : null,
            badgeColor: 'bg-rose-100 text-rose-800'
          },
          { id: 'routes', label: 'Route Coverage & Network', icon: FaRoute },
          { id: 'workforce', label: 'Workforce & Field SLA', icon: UserGroupIcon },
          {
            id: 'complaints',
            label: 'Complaints, CAPA & SLA',
            icon: ChatBubbleLeftRightIcon,
            badge: (complaintsSummary.overdue || complaintsSummary.pending) > 0 ? (complaintsSummary.overdue || complaintsSummary.pending) : null,
            badgeColor: 'bg-amber-100 text-amber-800'
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs whitespace-nowrap transition-all duration-200 border ${
                isActive
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-xs border-red-600'
                  : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50 shadow-xs'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-medium ${
                    isActive ? 'bg-white text-red-600' : (tab.badgeColor || 'bg-red-100 text-red-700')
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          TAB 1: EXECUTIVE OVERVIEW
      ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Top KPI Cards Row with Target Benchmarks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {isLoading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              <>
                {/* 1. Cycle Coverage & Audits */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs hover:shadow-sm transition-shadow relative overflow-hidden group">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Network Coverage</span>
                    <span className="p-1.5 rounded-md bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                      <ClipboardDocumentCheckIcon className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div className="mt-1">
                    <div className="flex items-baseline gap-1">
                      <h3 className="text-xl sm:text-2xl font-semibold text-slate-800">{coverageRate}%</h3>
                      <span className="text-[10px] text-slate-400 font-normal">({uniqueShopsAudited}/{shopCount})</span>
                    </div>
                    {/* Micro Progress Bar */}
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div
                        style={{ width: `${Math.min(coverageRate, 100)}%` }}
                        className={`h-full ${coverageRate >= 85 ? 'bg-emerald-500' : coverageRate >= 65 ? 'bg-amber-500' : 'bg-red-500'}`}
                      ></div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center justify-between font-normal">
                      <span>Target: <span className="font-medium text-slate-600">90%</span></span>
                      <span className="text-emerald-600 font-medium">{completedCount} audits done</span>
                    </p>
                  </div>
                </div>

                {/* 2. Quality Score & Pass Rate */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs hover:shadow-sm transition-shadow relative overflow-hidden group">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Quality Index</span>
                    <span className="p-1.5 rounded-md bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                      <FaStar className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div className="mt-1">
                    <div className="flex items-baseline gap-1">
                      <h3 className="text-xl sm:text-2xl font-semibold text-slate-800">{avgScore}</h3>
                      <span className="text-xs text-slate-400 font-normal">/ 5</span>
                      <span className="ml-1 text-[10px] font-medium text-amber-700 bg-amber-50 px-1 py-0.2 rounded">
                        {avgPercentage}%
                      </span>
                    </div>
                    {/* Micro Progress Bar */}
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div
                        style={{ width: `${passRate}%` }}
                        className={`h-full ${passRate >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      ></div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center justify-between font-normal">
                      <span>Pass: <span className="font-medium text-emerald-600">{passRate}%</span> (A+/A)</span>
                      <span className="text-slate-400">Target 85%</span>
                    </p>
                  </div>
                </div>

                {/* 3. Critical Non-Compliance Risk */}
                <div
                  onClick={() => setActiveTab('quality')}
                  className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs hover:shadow-sm transition-shadow relative overflow-hidden group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Critical Risk (C/D)</span>
                    <span className="p-1.5 rounded-md bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                      <FaExclamationTriangle className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div className="mt-1">
                    <div className="flex items-baseline gap-1">
                      <h3 className="text-xl sm:text-2xl font-semibold text-rose-600">{criticalRiskCount}</h3>
                      <span className="text-[10px] text-rose-500 font-normal">({criticalRiskRate}% fail)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div
                        style={{ width: `${Math.min(criticalRiskRate * 3, 100)}%` }}
                        className="h-full bg-rose-500"
                      ></div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 font-normal">
                      {healthSegments.critical} outlets scoring below 60%
                    </p>
                  </div>
                </div>

                {/* 4. Field Audit Duration SLA */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs hover:shadow-sm transition-shadow relative overflow-hidden group">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Avg Audit Duration</span>
                    <span className="p-1.5 rounded-md bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <ClockIcon className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div className="mt-1">
                    <div className="flex items-baseline gap-1">
                      <h3 className="text-xl sm:text-2xl font-semibold text-slate-800">{avgDurationMinutes || 42}</h3>
                      <span className="text-[10px] text-slate-400 font-normal">mins / audit</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div
                        style={{ width: `${Math.min(((avgDurationMinutes || 42) / 60) * 100, 100)}%` }}
                        className="h-full bg-indigo-500"
                      ></div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center justify-between font-normal">
                      <span>SLA: <span className="font-medium text-slate-600">45m</span></span>
                      <span className="text-indigo-600 font-medium">{attendanceSummary.attendanceRate}% Present</span>
                    </p>
                  </div>
                </div>

                {/* 5. Immediate Risk Interventions */}
                <div
                  onClick={() => setActiveTab('compliance')}
                  className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs hover:shadow-sm transition-shadow relative overflow-hidden group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Urgent Alerts</span>
                    <span className="p-1.5 rounded-md bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <FaStoreSlash className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div className="mt-1">
                    <h3 className="text-xl sm:text-2xl font-semibold text-purple-700">{totalUrgentAlerts}</h3>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div
                        style={{ width: `${Math.min(totalUrgentAlerts * 10, 100)}%` }}
                        className="h-full bg-purple-500"
                      ></div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 truncate font-normal">
                      {expiredOutlets.length} Expired • {fssaiBreakdown.expired} Lapsed FSSAI
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Franchise Network Health Matrix (PM Segmentation) */}
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2.5 border-b pb-2 border-slate-100 gap-1.5">
              <div>
                <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckBadgeIcon className="w-4 h-4 text-red-600" /> Franchise Outlet Health Segmentation
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5 font-normal">
                  Portfolio risk distribution based on latest completed operational audits
                </p>
              </div>
              <span className="text-[11px] font-normal text-slate-500">
                Total Rated: <span className="font-semibold text-slate-700">{topShops.length + leastShops.length > 0 ? (healthSegments.pinnacle + healthSegments.healthy + healthSegments.watchlist + healthSegments.critical) : 0} Outlets</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {/* Pinnacle */}
              <div className="p-2.5 rounded-md bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-800">Pinnacle Tier</span>
                  <h4 className="text-base font-semibold text-emerald-950 mt-0.5">{healthSegments.pinnacle} Outlets</h4>
                  <p className="text-[9px] text-emerald-700 mt-0.5 font-normal">Score &ge; 4.5 / 5 (90%+)</p>
                </div>
                <span className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-900 font-medium flex items-center justify-center text-[10px]">
                  A+
                </span>
              </div>

              {/* Healthy */}
              <div className="p-2.5 rounded-md bg-teal-50/60 border border-teal-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-teal-800">Healthy Standard</span>
                  <h4 className="text-base font-semibold text-teal-950 mt-0.5">{healthSegments.healthy} Outlets</h4>
                  <p className="text-[9px] text-teal-700 mt-0.5 font-normal">Score 3.75 - 4.4 / 5 (75-89%)</p>
                </div>
                <span className="w-6 h-6 rounded-full bg-teal-200 text-teal-900 font-medium flex items-center justify-center text-[10px]">
                  A
                </span>
              </div>

              {/* Watchlist */}
              <div className="p-2.5 rounded-md bg-amber-50/60 border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-amber-800">Watchlist Tier</span>
                  <h4 className="text-base font-semibold text-amber-950 mt-0.5">{healthSegments.watchlist} Outlets</h4>
                  <p className="text-[9px] text-amber-700 mt-0.5 font-normal">Score 3.0 - 3.7 / 5 (60-74%)</p>
                </div>
                <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 font-medium flex items-center justify-center text-[10px]">
                  B
                </span>
              </div>

              {/* Critical Intervention */}
              <div className="p-2.5 rounded-md bg-rose-50/60 border border-rose-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-rose-800">Critical Action</span>
                  <h4 className="text-base font-semibold text-rose-950 mt-0.5">{healthSegments.critical} Outlets</h4>
                  <p className="text-[9px] text-rose-700 mt-0.5 font-normal">Score &lt; 3.0 / 5 (&lt;60%)</p>
                </div>
                <span className="w-6 h-6 rounded-full bg-rose-200 text-rose-900 font-medium flex items-center justify-center text-[10px]">
                  C/D
                </span>
              </div>
            </div>
          </div>

          {/* Audit Operational Funnel Pipeline */}
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1.5">
              <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FaTasks className="text-red-600" /> Audit Lifecycle & Pipeline Velocity
              </h2>
              <span className="text-[11px] text-slate-400 font-normal">
                Total Tracked In Period: <span className="font-medium text-slate-700">{auditsCount} Audits</span>
              </span>
            </div>
            
            {/* Progress Bar Container */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
              <div
                style={{ width: `${auditsCount > 0 ? (completedCount / auditsCount) * 100 : 0}%` }}
                className="bg-emerald-500 h-full transition-all duration-500"
                title={`Completed: ${completedCount}`}
              ></div>
              <div
                style={{ width: `${auditsCount > 0 ? (pendingApprovalCount / auditsCount) * 100 : 0}%` }}
                className="bg-purple-500 h-full transition-all duration-500"
                title={`Pending Approval: ${pendingApprovalCount}`}
              ></div>
              <div
                style={{ width: `${auditsCount > 0 ? (inProgressCount / auditsCount) * 100 : 0}%` }}
                className="bg-blue-500 h-full transition-all duration-500"
                title={`In Progress: ${inProgressCount}`}
              ></div>
              <div
                style={{ width: `${auditsCount > 0 ? (pendingCount / auditsCount) * 100 : 0}%` }}
                className="bg-amber-500 h-full transition-all duration-500"
                title={`Pending Scheduled: ${pendingCount}`}
              ></div>
            </div>

            {/* Pipeline Legend */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-2.5 pt-2 border-t border-slate-100 text-center">
              <div>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span>
                <span className="text-[11px] font-medium text-slate-700">Completed ({completedCount})</span>
                <p className="text-[9px] text-slate-400 mt-0.5 font-normal">
                  {auditsCount > 0 ? Math.round((completedCount / auditsCount) * 100) : 0}% of cycle
                </p>
              </div>
              <div>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-500 mr-1"></span>
                <span className="text-[11px] font-medium text-slate-700">Pending Approval ({pendingApprovalCount})</span>
                <p className="text-[9px] text-slate-400 mt-0.5 font-normal">Requires Sign-off</p>
              </div>
              <div>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mr-1"></span>
                <span className="text-[11px] font-medium text-slate-700">In Progress ({inProgressCount})</span>
                <p className="text-[9px] text-slate-400 mt-0.5 font-normal">Field active</p>
              </div>
              <div>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mr-1"></span>
                <span className="text-[11px] font-medium text-slate-700">Scheduled / Pending ({pendingCount})</span>
                <p className="text-[9px] text-slate-400 mt-0.5 font-normal">Awaiting visit</p>
              </div>
            </div>
          </div>

          {/* Operational Trend & Top Performers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Audit Trends Area/Line Chart (2 Cols) */}
            <div className="lg:col-span-2 bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2.5 border-b pb-2 border-slate-100">
                <div className="flex items-center gap-1.5">
                  <ArrowTrendingUpIcon className="w-3.5 h-3.5 text-red-600" />
                  <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                    Daily Audit Volume & Quality Score Trends
                  </h2>
                </div>
                <span className="text-[10px] text-slate-400 font-normal">Continuous Monitoring</span>
              </div>

              {auditTrend.length > 0 ? (
                <div className="h-52 w-full">
                  <Line
                    data={{
                      labels: auditTrend.map((t) => dayjs(t._id).format('DD MMM')),
                      datasets: [
                        {
                          label: 'Completed Audits',
                          data: auditTrend.map((t) => t.completed || 0),
                          borderColor: '#b91c1c',
                          backgroundColor: 'rgba(185, 28, 28, 0.10)',
                          fill: true,
                          tension: 0.35,
                          yAxisID: 'y',
                        },
                        {
                          label: 'Avg Score (Rating / 5)',
                          data: auditTrend.map((t) => t.avgRating ? Number(t.avgRating.toFixed(1)) : null),
                          borderColor: '#d97706',
                          backgroundColor: '#d97706',
                          borderDash: [4, 4],
                          tension: 0.35,
                          yAxisID: 'y1',
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'top', labels: { boxWidth: 8, font: { size: 9, weight: 'normal' } } },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: { display: true, text: 'Audits', font: { size: 9, weight: 'normal' } },
                          ticks: { font: { size: 9 } }
                        },
                        y1: {
                          position: 'right',
                          min: 0,
                          max: 5,
                          grid: { drawOnChartArea: false },
                          title: { display: true, text: 'Score', font: { size: 9, weight: 'normal' } },
                          ticks: { font: { size: 9 } }
                        },
                        x: {
                          ticks: { font: { size: 9 } }
                        }
                      },
                    }}
                  />
                </div>
              ) : (
                <div className="h-52 flex items-center justify-center text-slate-400 text-xs font-normal">
                  No trend data available for selected period.
                </div>
              )}
            </div>

            {/* Quick Expiry & Compliance Radar (1 Col) */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2.5 border-b pb-2 border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <FaStoreSlash className="w-3.5 h-3.5 text-purple-600" />
                    <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                      Expired Stock Incidents
                    </h2>
                  </div>
                  <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.2 rounded-full font-medium">
                    {expiredOutlets.length} Flagged
                  </span>
                </div>

                {expiredOutlets.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                    {expiredOutlets.slice(0, 5).map((shop, i) => (
                      <div
                        key={i}
                        onClick={() => setExpiredModal({ isOpen: true, shopData: shop })}
                        className="p-2 bg-purple-50/40 hover:bg-purple-50 border border-purple-100 rounded-md cursor-pointer transition-colors flex items-center justify-between"
                      >
                        <div className="min-w-0 pr-1.5">
                          <p className="text-xs font-medium text-slate-800 truncate">{shop.shopName}</p>
                          <p className="text-[9px] text-slate-400 mt-0.5 font-normal">
                            {dayjs(shop.auditDate).format('DD MMM YYYY')}
                          </p>
                        </div>
                        <span className="text-[9px] font-medium px-1.5 py-0.2 rounded bg-purple-200 text-purple-900 whitespace-nowrap">
                          {shop.count || 1} Items
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-5 text-center text-slate-400 text-xs font-normal">
                    <CheckCircleIcon className="w-6 h-6 text-emerald-500 mx-auto mb-1 opacity-80" />
                    <p className="text-[11px]">No expired stock detected in recent audits.</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setActiveTab('compliance')}
                className="mt-3 w-full py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-md border border-slate-200 flex items-center justify-center gap-1 transition-colors"
              >
                Inspect All Compliance Risks <ChevronRightIcon className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Franchise Ranking: Top vs Bottom */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Rating Shops */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-xs p-3.5">
              <div className="flex items-center justify-between mb-2.5 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5">
                  <FaSortAmountUp className="text-emerald-500 w-3 h-3" />
                  <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                    Top Performing Outlets
                  </h2>
                </div>
                <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.2 rounded-full">
                  Leaderboard
                </span>
              </div>

              {topShops.length > 0 ? (
                <div className="space-y-1.5">
                  {topShops.map((s, idx) => (
                    <div
                      key={s._id}
                      className="flex items-center justify-between p-2 rounded-md bg-slate-50 hover:bg-emerald-50/40 border border-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-medium flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-normal text-slate-700 truncate max-w-[180px] sm:max-w-xs">
                          {s.shopName}
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                        <FaStar className="text-amber-500 w-2.5 h-2.5" /> {s.averageRating}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 p-3 text-center font-normal">No completed audits recorded for this period.</p>
              )}
            </div>

            {/* Least Rating Shops */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-xs p-3.5">
              <div className="flex items-center justify-between mb-2.5 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5">
                  <FaSortAmountDown className="text-rose-500 w-3 h-3" />
                  <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                    Needs Attention (Lowest Rated)
                  </h2>
                </div>
                <span className="text-[10px] text-rose-700 font-medium bg-rose-50 px-2 py-0.2 rounded-full">
                  Priority Action
                </span>
              </div>

              {leastShops.length > 0 ? (
                <div className="space-y-1.5">
                  {leastShops.map((s, idx) => (
                    <div
                      key={s._id}
                      className="flex items-center justify-between p-2 rounded-md bg-slate-50 hover:bg-rose-50/40 border border-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-800 text-[9px] font-medium flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-normal text-slate-700 truncate max-w-[180px] sm:max-w-xs">
                          {s.shopName}
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-[10px] font-medium text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200/60">
                        <FaStar className="text-amber-500 w-2.5 h-2.5" /> {s.averageRating}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 p-3 text-center font-normal">No low-rated shops in this period.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          TAB 2: AUDITS & QUALITY ANALYTICS (V2)
      ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'quality' && (
        <div className="space-y-4">
          {/* Top Grade Distribution & Section Breakdown Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Grade Breakdown Donut Chart (1 Col) */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2.5 border-b border-slate-100 pb-2">
                  <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FaMedal className="text-amber-500 w-3.5 h-3.5" /> Quality Grade Distribution
                  </h2>
                  <span className="text-[10px] text-slate-400 font-normal">Completed Audits</span>
                </div>

                <div className="h-44 relative flex items-center justify-center">
                  <Doughnut
                    data={{
                      labels: ['A+ (90%+)', 'A (75-89%)', 'B (60-74%)', 'C (40-59%)', 'D (<40%)'],
                      datasets: [
                        {
                          data: [
                            gradeDistribution['A+'] || 0,
                            gradeDistribution['A'] || 0,
                            gradeDistribution['B'] || 0,
                            gradeDistribution['C'] || 0,
                            gradeDistribution['D'] || 0,
                          ],
                          backgroundColor: ['#059669', '#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
                          borderWidth: 2,
                          borderColor: '#ffffff',
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'bottom', labels: { boxWidth: 8, font: { size: 9, weight: 'normal' } } },
                      },
                      cutout: '68%',
                    }}
                  />
                  <div className="absolute text-center pointer-events-none pb-5">
                    <span className="text-lg font-semibold text-slate-800">{completedCount}</span>
                    <p className="text-[9px] text-slate-400 uppercase font-medium">Graded</p>
                  </div>
                </div>
              </div>

              {/* Grade Stats Badges */}
              <div className="grid grid-cols-5 gap-1 pt-2 border-t border-slate-100 text-center">
                <div className="p-1 rounded bg-emerald-50">
                  <span className="text-[9px] font-medium text-emerald-800">A+</span>
                  <p className="text-[11px] font-semibold text-emerald-700">{gradeDistribution['A+'] || 0}</p>
                </div>
                <div className="p-1 rounded bg-teal-50">
                  <span className="text-[9px] font-medium text-teal-800">A</span>
                  <p className="text-[11px] font-semibold text-teal-700">{gradeDistribution['A'] || 0}</p>
                </div>
                <div className="p-1 rounded bg-blue-50">
                  <span className="text-[9px] font-medium text-blue-800">B</span>
                  <p className="text-[11px] font-semibold text-blue-700">{gradeDistribution['B'] || 0}</p>
                </div>
                <div className="p-1 rounded bg-amber-50">
                  <span className="text-[9px] font-medium text-amber-800">C</span>
                  <p className="text-[11px] font-semibold text-amber-700">{gradeDistribution['C'] || 0}</p>
                </div>
                <div className="p-1 rounded bg-rose-50">
                  <span className="text-[9px] font-medium text-rose-800">D</span>
                  <p className="text-[11px] font-semibold text-rose-700">{gradeDistribution['D'] || 0}</p>
                </div>
              </div>
            </div>

            {/* Template Section Compliance Horizontal Bar (2 Cols) */}
            <div className="lg:col-span-2 bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2.5 border-b border-slate-100 pb-2">
                <div>
                  <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FaCoffee className="text-red-600 w-3.5 h-3.5" /> Section-wise Quality & Hygiene Score (%)
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-normal">Aggregated performance across active audit sections</p>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Average Compliance</span>
              </div>

              {sectionPerformance.length > 0 ? (
                <div className="h-52 w-full">
                  <Bar
                    data={{
                      labels: sectionPerformance.map((s) => s.sectionName),
                      datasets: [
                        {
                          label: 'Compliance %',
                          data: sectionPerformance.map((s) => s.avgPercentage),
                          backgroundColor: sectionPerformance.map((s) =>
                            s.avgPercentage >= 80 ? '#10b981' : s.avgPercentage >= 65 ? '#f59e0b' : '#ef4444'
                          ),
                          borderRadius: 4,
                        },
                      ],
                    }}
                    options={{
                      indexAxis: 'y',
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        x: { min: 0, max: 100, ticks: { callback: (v) => `${v}%`, font: { size: 9 } } },
                        y: { ticks: { font: { size: 9.5, weight: 'normal' } } },
                      },
                    }}
                  />
                </div>
              ) : (
                <div className="h-52 flex items-center justify-center text-slate-400 text-xs font-normal">
                  No section-level data available for current selection.
                </div>
              )}
            </div>
          </div>

          {/* Section Ranking & Training Action Matrix */}
          {sectionPerformance.length > 0 && (
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2.5 border-b border-slate-100 pb-2">
                <div>
                  <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FaLightbulb className="text-amber-500 w-3.5 h-3.5" /> Section Hygiene & SOP Performance Breakdown
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-normal">Identifies systemic weaknesses to guide barista and store manager coaching</p>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded">
                  {sectionPerformance.length} Active Sections
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-medium text-[10px]">
                      <th className="py-2 px-2.5">Audit Section</th>
                      <th className="py-2 px-2.5 text-center">Score %</th>
                      <th className="py-2 px-2.5 text-center">Health Status</th>
                      <th className="py-2 px-2.5">Recommendation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sectionPerformance.map((sec, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2 px-2.5 font-medium text-slate-800">
                          {sec.sectionName}
                        </td>
                        <td className="py-2 px-2.5 text-center font-semibold text-slate-800">
                          {sec.avgPercentage}%
                        </td>
                        <td className="py-2 px-2.5 text-center">
                          <span
                            className={`px-2 py-0.2 rounded-full font-medium text-[9px] ${
                              sec.avgPercentage >= 80
                                ? 'bg-emerald-100 text-emerald-800'
                                : sec.avgPercentage >= 65
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {sec.avgPercentage >= 80 ? 'Healthy' : sec.avgPercentage >= 65 ? 'Moderate' : 'Critical'}
                          </span>
                        </td>
                        <td className="py-2 px-2.5 text-[11px] text-slate-500 font-normal">
                          {sec.avgPercentage >= 80
                            ? 'Operating within standard hygiene limits. Continue random audit spot-checks.'
                            : sec.avgPercentage >= 65
                            ? 'Requires refresher briefing on standard operating procedures for barista staff.'
                            : 'Immediate supervisor audit and deep cleaning intervention required.'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recent Completed Audits Searchable Stream */}
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2.5 border-b border-slate-100 pb-2 gap-2">
              <div>
                <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ClipboardDocumentCheckIcon className="w-4 h-4 text-red-600" /> Completed Audits Stream & Reports
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5 font-normal">Direct access to verified field audit report sheets</p>
              </div>

              {/* Search Box */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-700 w-full sm:w-52">
                  <MagnifyingGlassIcon className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
                  <input
                    type="text"
                    value={auditSearchQuery}
                    onChange={(e) => setAuditSearchQuery(e.target.value)}
                    placeholder="Search shop, auditor..."
                    className="bg-transparent outline-none w-full text-xs font-normal"
                  />
                  {auditSearchQuery && (
                    <button onClick={() => setAuditSearchQuery('')} className="text-slate-400 hover:text-slate-600 text-xs">
                      ✕
                    </button>
                  )}
                </div>

                <Link to="/reports" className="text-xs text-red-600 hover:text-red-700 font-medium whitespace-nowrap">
                  View All &rarr;
                </Link>
              </div>
            </div>

            {filteredRecentAudits.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-medium text-[10px]">
                      <th className="py-2 px-2.5">Outlet</th>
                      <th className="py-2 px-2.5">Auditor</th>
                      <th className="py-2 px-2.5 text-center">Grade</th>
                      <th className="py-2 px-2.5 text-center">Score %</th>
                      <th className="py-2 px-2.5 text-center">Rating</th>
                      <th className="py-2 px-2.5 text-center">Duration</th>
                      <th className="py-2 px-2.5 text-center">Signed By</th>
                      <th className="py-2 px-2.5">Audit Date</th>
                      <th className="py-2 px-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRecentAudits.map((a) => (
                      <tr key={a._id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2 px-2.5 font-medium text-slate-800 truncate max-w-[140px]">
                          {a.shop?.shopName || 'Outlet'}
                        </td>
                        <td className="py-2 px-2.5 text-slate-500 truncate max-w-[110px] font-normal">
                          {a.auditor?.name || '—'}
                        </td>
                        <td className="py-2 px-2.5 text-center">
                          <span
                            className={`px-1.5 py-0.2 rounded-full font-medium text-[9px] ${
                              ['A+', 'A'].includes(a.overallGrade)
                                ? 'bg-emerald-100 text-emerald-800'
                                : a.overallGrade === 'B'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {a.overallGrade || '—'}
                          </span>
                        </td>
                        <td className="py-2 px-2.5 text-center font-medium text-slate-700">
                          {a.finalPercentage || 0}%
                        </td>
                        <td className="py-2 px-2.5 text-center font-medium text-amber-600">
                          {a.overallRating || 0} / 5
                        </td>
                        <td className="py-2 px-2.5 text-center text-slate-500 text-[11px] font-normal">
                          {a.durationMinutes ? `${a.durationMinutes} min` : '—'}
                        </td>
                        <td className="py-2 px-2.5 text-center">
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-normal ${
                            a.signaturedBy === 'owner' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {a.signaturedBy || 'unverified'}
                          </span>
                        </td>
                        <td className="py-2 px-2.5 text-slate-400 whitespace-nowrap text-[11px] font-normal">
                          {dayjs(a.auditDate).format('DD MMM YYYY')}
                        </td>
                        <td className="py-2 px-2.5 text-right whitespace-nowrap">
                          <Link
                            to={`/audit-v2/detail/${a._id}`}
                            className="text-xs text-red-600 hover:text-red-800 font-medium underline"
                          >
                            View Report
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-400 p-4 text-center font-normal">No matching audits found.</p>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          TAB 3: SHOP COMPLIANCE & RISKS
      ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'compliance' && (
        <div className="space-y-4">
          {/* Compliance Matrix Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-[10px] font-medium text-rose-700 uppercase tracking-wider">Critical Non-Compliant Outlets</span>
                <h3 className="text-lg sm:text-xl font-semibold text-rose-900 mt-0.5">
                  {expiredOutlets.length + fssaiBreakdown.expired}
                </h3>
                <p className="text-[10px] text-rose-600 mt-0.5 font-normal">{expiredOutlets.length} expired stock • {fssaiBreakdown.expired} lapsed FSSAI</p>
              </div>
              <FaExclamationTriangle className="w-5 h-5 text-rose-500 opacity-80" />
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-[10px] font-medium text-amber-700 uppercase tracking-wider">License Expirations (30 Days)</span>
                <h3 className="text-lg sm:text-xl font-semibold text-amber-900 mt-0.5">
                  {fssaiBreakdown.urgent15d + fssaiBreakdown.warning30d + visibleCommercial.filter(s => {
                    const d = getDaysLeft(s.renewalDate);
                    return d !== null && d >= 0 && d <= 30;
                  }).length}
                </h3>
                <p className="text-[10px] text-amber-600 mt-0.5 font-normal">Renewals due within the next month</p>
              </div>
              <ClockIcon className="w-5 h-5 text-amber-500 opacity-80" />
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-[10px] font-medium text-emerald-700 uppercase tracking-wider">Fully Compliant Outlets</span>
                <h3 className="text-lg sm:text-xl font-semibold text-emerald-900 mt-0.5">
                  {Math.max(0, shopCount - expiredOutlets.length - fssaiBreakdown.expired)}
                </h3>
                <p className="text-[10px] text-emerald-600 mt-0.5 font-normal">Zero critical safety & regulatory violations</p>
              </div>
              <ShieldCheckIcon className="w-5 h-5 text-emerald-500 opacity-80" />
            </div>
          </div>

          {/* Expired Stock Dedicated Inspector Section */}
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2.5 border-b border-slate-100 pb-2">
              <div>
                <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <FaStoreSlash className="w-3.5 h-3.5 text-purple-600" /> Expired Stock Non-Compliance Matrix
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5 font-normal">
                  Stores with expired items flagged during physical auditor inspections in the last 30 days
                </p>
              </div>
              <span className="text-[10px] bg-purple-100 text-purple-900 font-medium px-2 py-0.5 rounded-full">
                {expiredOutlets.length} Violating Outlets
              </span>
            </div>

            {expiredOutlets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {expiredOutlets.map((shop) => (
                  <div
                    key={shop._id}
                    onClick={() => setExpiredModal({ isOpen: true, shopData: shop })}
                    className="p-2.5 rounded-md border border-purple-200 bg-purple-50/40 hover:bg-purple-50 transition-all cursor-pointer flex flex-col justify-between group shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-medium text-slate-800 truncate">{shop.shopName}</h4>
                        <span className="text-[9px] font-medium px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 border border-rose-200">
                          {shop.count || 1} Items
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-normal">
                        Audit Date: {dayjs(shop.auditDate).format('DD MMM YYYY')}
                      </p>
                      <p className="text-[10px] text-purple-800 mt-1 font-normal truncate">
                        Sample: {shop.expiredProducts?.[0]?.name || 'Flagged item'}
                      </p>
                    </div>

                    <div className="mt-2 pt-1 border-t border-purple-100 flex items-center justify-between text-[10px] text-purple-700 font-medium group-hover:text-purple-900">
                      <span>View itemized breakdown</span>
                      <ChevronRightIcon className="w-3 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 text-center text-slate-400 text-xs font-normal">
                <CheckCircleIcon className="w-7 h-7 text-emerald-500 mx-auto mb-1 opacity-80" />
                <p className="font-medium text-slate-700">All outlets comply with product expiry standards.</p>
                <p className="text-[10px] mt-0.5">No expired raw materials or pre-packaged goods detected.</p>
              </div>
            )}
          </div>

          {/* FSSAI & Commercial Licenses Watchlist */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* FSSAI Licenses */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-xs p-3.5">
              <div className="flex items-center justify-between mb-2.5 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5">
                  <FaExclamationTriangle className="text-amber-500 w-3 h-3" />
                  <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                    FSSAI Certificate Status
                  </h2>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.2 rounded-full font-medium">
                  {visibleFssai.length} Alerts
                </span>
              </div>

              {visibleFssai.length > 0 ? (
                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                  {visibleFssai.map((shop) => {
                    const days = getDaysLeft(shop.fssiRenewalDate);
                    const isExpired = days !== null && days < 0;
                    return (
                      <div
                        key={shop._id}
                        onClick={() => navigate('/addshop', { state: { shop, isEdit: true } })}
                        className={`flex items-center justify-between p-2 rounded-md border transition-colors cursor-pointer ${
                          isExpired ? 'bg-rose-50/40 border-rose-200 hover:bg-rose-50' : 'bg-slate-50 border-slate-100 hover:bg-amber-50/40'
                        }`}
                      >
                        <div className="min-w-0 pr-1.5">
                          <p className="text-xs font-normal text-slate-800 truncate">{shop.shopName}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-normal">
                            Renewal: {dayjs(shop.fssiRenewalDate).format('DD MMM YYYY')}
                          </p>
                        </div>
                        <span
                          className={`text-[9px] font-medium px-1.5 py-0.2 rounded whitespace-nowrap ${
                            isExpired ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isExpired ? `Expired ${Math.abs(days)}d ago` : `${days}d left`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-400 p-3 text-center font-normal">All shops have valid FSSAI licenses.</p>
              )}
            </div>

            {/* Commercial Agreements */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-xs p-3.5">
              <div className="flex items-center justify-between mb-2.5 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5">
                  <FaShieldAlt className="text-blue-500 w-3 h-3" />
                  <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                    Commercial Agreement Watchlist
                  </h2>
                </div>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.2 rounded-full font-medium">
                  {visibleCommercial.length} Alerts
                </span>
              </div>

              {visibleCommercial.length > 0 ? (
                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                  {visibleCommercial.map((shop) => {
                    const days = getDaysLeft(shop.renewalDate);
                    const isExpired = days !== null && days < 0;
                    return (
                      <div
                        key={shop._id}
                        onClick={() => navigate('/addshop', { state: { shop, isEdit: true } })}
                        className={`flex items-center justify-between p-2 rounded-md border transition-colors cursor-pointer ${
                          isExpired ? 'bg-rose-50/40 border-rose-200 hover:bg-rose-50' : 'bg-slate-50 border-slate-100 hover:bg-blue-50/40'
                        }`}
                      >
                        <div className="min-w-0 pr-1.5">
                          <p className="text-xs font-normal text-slate-800 truncate">{shop.shopName}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-normal">
                            Renewal: {dayjs(shop.renewalDate).format('DD MMM YYYY')}
                          </p>
                        </div>
                        <span
                          className={`text-[9px] font-medium px-1.5 py-0.2 rounded whitespace-nowrap ${
                            isExpired ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {isExpired ? `Expired ${Math.abs(days)}d ago` : `${days}d left`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-400 p-3 text-center font-normal">No commercial agreement renewals due soon.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          TAB 4: ROUTE COVERAGE & FIELD NETWORK
      ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'routes' && (
        <div className="space-y-4">
          {/* Routes High-Level Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Total Field Routes</span>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mt-0.5">{routesList.length || routesCount}</h3>
              <p className="text-[10px] text-slate-400 mt-0.5 font-normal">Active logistical clusters</p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Total Network Outlets</span>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mt-0.5">{shopCount}</h3>
              <p className="text-[10px] text-slate-400 mt-0.5 font-normal">Assigned to field routes</p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
              <span className="text-[10px] font-medium text-emerald-800 uppercase tracking-wider">Audited in Period</span>
              <h3 className="text-lg sm:text-xl font-semibold text-emerald-950 mt-0.5">{uniqueShopsAudited}</h3>
              <p className="text-[10px] text-emerald-700 mt-0.5 font-normal">Overall Coverage: {coverageRate}%</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
              <span className="text-[10px] font-medium text-amber-800 uppercase tracking-wider">Pending Audit Visits</span>
              <h3 className="text-lg sm:text-xl font-semibold text-amber-950 mt-0.5">{Math.max(0, shopCount - uniqueShopsAudited)}</h3>
              <p className="text-[10px] text-amber-700 mt-0.5 font-normal">Requires schedule assignment</p>
            </div>
          </div>

          {/* Route-by-Route Progress Cards Grid */}
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2.5 border-b border-slate-100 pb-2">
              <div>
                <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <FaRoute className="text-red-600 w-3.5 h-3.5" /> Route Operational Execution Velocity
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5 font-normal">
                  Percentage of stores audited within each logistical route during the selected time period
                </p>
              </div>
              <Link to="/routes" className="text-xs text-red-600 hover:text-red-800 font-medium">
                Configure Routes &rarr;
              </Link>
            </div>

            {routesList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {routesList.map((route) => {
                  const rate = route.coverageRate || 0;
                  const isHigh = rate >= 80;
                  const isMid = rate >= 50 && rate < 80;
                  return (
                    <div
                      key={route._id}
                      className="p-2.5 rounded-md border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-medium text-slate-800 truncate">{route.name}</h4>
                          <span
                            className={`text-[9px] font-medium px-1.5 py-0.2 rounded-full ${
                              isHigh
                                ? 'bg-emerald-100 text-emerald-800'
                                : isMid
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {isHigh ? 'On Track' : isMid ? 'Progressing' : 'Behind'}
                          </span>
                        </div>

                        <div className="mt-2 flex items-baseline justify-between">
                          <span className="text-[11px] text-slate-400 font-normal">Coverage</span>
                          <span className="text-sm font-semibold text-slate-800">{rate}%</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                          <div
                            style={{ width: `${rate}%` }}
                            className={`h-full ${isHigh ? 'bg-emerald-500' : isMid ? 'bg-amber-500' : 'bg-rose-500'}`}
                          ></div>
                        </div>

                        <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 font-normal">
                          <span>Audited: <span className="font-medium text-slate-700">{route.auditedCount || 0}</span></span>
                          <span>Total: <span className="font-medium text-slate-700">{route.shopsCount}</span></span>
                          <span>Pending: <span className="font-medium text-amber-700">{route.pendingCount || 0}</span></span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedRoute(route._id);
                          setActiveTab('overview');
                        }}
                        className="mt-2.5 w-full py-1 rounded border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 text-xs font-normal transition-colors text-center"
                      >
                        Filter Dashboard by this Route
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 p-4 text-center font-normal">No routes configured in database.</p>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          TAB 5: WORKFORCE & AUDITOR SLA
      ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'workforce' && (
        <div className="space-y-4">
          {/* Workforce Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Total Field Personnel</span>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mt-0.5">{attendanceSummary.totalEmployees || auditorsCount}</h3>
              <p className="text-[10px] text-slate-400 mt-0.5 font-normal">Auditors & employees</p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
              <span className="text-[10px] font-medium text-emerald-700 uppercase tracking-wider">Present Today</span>
              <h3 className="text-lg sm:text-xl font-semibold text-emerald-900 mt-0.5">{attendanceSummary.presentToday}</h3>
              <p className="text-[10px] text-emerald-600 mt-0.5 font-normal">Attendance: {attendanceSummary.attendanceRate}%</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
              <span className="text-[10px] font-medium text-amber-700 uppercase tracking-wider">Approved Leave</span>
              <h3 className="text-lg sm:text-xl font-semibold text-amber-900 mt-0.5">{attendanceSummary.onLeaveToday}</h3>
              <p className="text-[10px] text-amber-600 mt-0.5 font-normal">Active leave approval</p>
            </div>

            <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg">
              <span className="text-[10px] font-medium text-rose-700 uppercase tracking-wider">Absent / Unrecorded</span>
              <h3 className="text-lg sm:text-xl font-semibold text-rose-900 mt-0.5">{attendanceSummary.absentToday}</h3>
              <p className="text-[10px] text-rose-600 mt-0.5 font-normal">Missing clock-in punch</p>
            </div>
          </div>

          {/* Auditor Throughput & Strictness Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2.5 border-b border-slate-100 pb-2">
                <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <FaChartBar className="text-blue-600 w-3.5 h-3.5" /> Field Auditor Completion Throughput
                </h2>
                <span className="text-[10px] text-slate-400 font-normal">Total Completed In Period</span>
              </div>

              {auditorPerformance.length > 0 ? (
                <div className="h-52 w-full">
                  <Bar
                    data={{
                      labels: auditorPerformance.map((a) => a.auditorName),
                      datasets: [
                        {
                          label: 'Audits Completed',
                          data: auditorPerformance.map((a) => a.auditsCompleted),
                          backgroundColor: '#2563eb',
                          borderRadius: 4,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        y: { beginAtZero: true, ticks: { precision: 0, font: { size: 9 } } },
                        x: { ticks: { font: { size: 9 } } },
                      },
                    }}
                  />
                </div>
              ) : (
                <div className="h-52 flex items-center justify-center text-slate-400 text-xs font-normal">
                  No completed audits by auditors this month.
                </div>
              )}
            </div>

            {/* Auditor Leaderboard Table */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2.5 border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                    Auditor Strictness & Quality
                  </h3>
                  <span className="text-[10px] text-slate-400 font-normal">Avg Rating</span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {auditorPerformance.map((a, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-md bg-slate-50 border border-slate-100">
                      <div>
                        <p className="text-xs font-medium text-slate-800 truncate">{a.auditorName}</p>
                        <p className="text-[9px] text-slate-400 font-normal">{a.auditsCompleted} Audits Completed</p>
                      </div>
                      <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                        {a.avgRating ? `${a.avgRating} ★` : '—'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to="/attendance-management"
                className="mt-2.5 w-full py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-normal rounded-md border border-slate-200 flex items-center justify-center gap-1 transition-colors"
              >
                View Attendance Roster <ChevronRightIcon className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Today's Live Attendance Feed */}
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2.5 border-b border-slate-100 pb-2">
              <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FaUserCheck className="text-emerald-600 w-3.5 h-3.5" /> Today's Field Attendance & Clock-in Log
              </h2>
              <Link to="/attendance-management" className="text-xs text-red-600 hover:text-red-800 font-medium">
                Manage Attendance &rarr;
              </Link>
            </div>

            {attendanceSummary.todayAttendanceList && attendanceSummary.todayAttendanceList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {attendanceSummary.todayAttendanceList.map((a, i) => (
                  <div key={i} className="p-2.5 rounded-md border border-slate-100 bg-slate-50 flex items-center gap-2">
                    {a.auditor?.profile ? (
                      <img src={a.auditor.profile} alt="" className="w-7 h-7 rounded-full object-cover border" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 font-medium flex items-center justify-center text-[10px]">
                        {a.auditor?.name?.charAt(0) || 'A'}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-800 truncate">{a.auditor?.name || 'Auditor'}</p>
                      <p className="text-[9px] text-slate-400 font-normal">
                        In: {a.checkIn?.time ? dayjs(a.checkIn.time).format('hh:mm A') : '—'}
                      </p>
                      <span className="inline-block mt-0.5 text-[8px] font-normal px-1 py-0.2 rounded bg-emerald-100 text-emerald-800">
                        {a.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 p-3 text-center font-normal">No attendance check-ins logged yet today.</p>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          TAB 6: COMPLAINTS, CAPA & RESOLUTION SLA
      ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Total Complaints</span>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mt-0.5">{complaintsSummary.total}</h3>
              <p className="text-[10px] text-slate-400 mt-0.5 font-normal">All-time customer & outlet issues</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
              <span className="text-[10px] font-medium text-amber-700 uppercase tracking-wider">Pending Review</span>
              <h3 className="text-lg sm:text-xl font-semibold text-amber-900 mt-0.5">{complaintsSummary.pending}</h3>
              <p className="text-[10px] text-amber-600 mt-0.5 font-normal">Requires supervisor response</p>
            </div>

            <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg">
              <span className="text-[10px] font-medium text-rose-700 uppercase tracking-wider">Overdue SLA Breaches</span>
              <h3 className="text-lg sm:text-xl font-semibold text-rose-900 mt-0.5">{complaintsSummary.overdue || 0}</h3>
              <p className="text-[10px] text-rose-600 mt-0.5 font-normal">Past target resolution date</p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
              <span className="text-[10px] font-medium text-emerald-700 uppercase tracking-wider">Resolved (SLA {complaintsSummary.resolutionRate}%)</span>
              <h3 className="text-lg sm:text-xl font-semibold text-emerald-900 mt-0.5">{complaintsSummary.resolved}</h3>
              <p className="text-[10px] text-emerald-600 mt-0.5 font-normal">CAPA documented & closed</p>
            </div>
          </div>

          {/* Recent Complaints List with CAPA status */}
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2.5 border-b border-slate-100 pb-2">
              <div>
                <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ChatBubbleLeftRightIcon className="w-4 h-4 text-red-600" /> Active Complaints & Corrective Action (CAPA) Log
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5 font-normal">Tracks root cause analysis and preventative remediation per outlet</p>
              </div>
              <Link to="/complaint-management" className="text-xs text-red-600 hover:text-red-800 font-medium">
                Open Complaint Portal &rarr;
              </Link>
            </div>

            {complaintsSummary.recentComplaints && complaintsSummary.recentComplaints.length > 0 ? (
              <div className="space-y-2">
                {complaintsSummary.recentComplaints.map((c) => {
                  const isOverdue = c.targetDate && new Date(c.targetDate) < new Date() && !['Resolved', 'Closed', 'Completed'].includes(c.status);
                  return (
                    <div
                      key={c._id}
                      className={`p-2.5 rounded-md border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                        isOverdue ? 'bg-rose-50/30 border-rose-200' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-medium text-slate-800">{c.outlet?.shopName || 'Outlet'}</h4>
                          {isOverdue && (
                            <span className="text-[8px] font-medium px-1.5 py-0.2 bg-rose-600 text-white rounded">
                              OVERDUE SLA
                            </span>
                          )}
                          {c.caPa && (
                            <span className="text-[8px] font-normal px-1.5 py-0.2 bg-indigo-100 text-indigo-800 rounded">
                              CAPA Logged
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 font-normal">{c.complaint}</p>
                        <p className="text-[9px] text-slate-400 mt-0.5 font-normal">
                          Logged by: {c.registeredBy?.name || 'Staff'} • Date: {dayjs(c.complaintDate).format('DD MMM YYYY')} • Target: {dayjs(c.targetDate).format('DD MMM YYYY')}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-center">
                        <span
                          className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${
                            ['Resolved', 'Closed', 'Completed'].includes(c.status)
                              ? 'bg-emerald-100 text-emerald-800'
                              : c.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 p-3 text-center font-normal">No complaints recorded recently.</p>
            )}
          </div>
        </div>
      )}

      {/* ── Expired Products Modal ── */}
      {expiredModal.isOpen && expiredModal.shopData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-lg overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-150">
            <div className="px-4 py-3 border-b border-slate-100 bg-purple-50/40 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">{expiredModal.shopData.shopName}</h3>
                <p className="text-[10px] text-purple-700 font-normal">Expired Stock Inspection Details</p>
              </div>
              <button
                onClick={() => setExpiredModal({ isOpen: false, shopData: null })}
                className="text-slate-400 hover:text-slate-600 bg-white rounded-full p-1 shadow-2xs text-xs"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 max-h-72 overflow-y-auto space-y-1.5 custom-scrollbar">
              {expiredModal.shopData.expiredProducts &&
                expiredModal.shopData.expiredProducts.map((prod, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-md">
                    <span className="font-normal text-xs text-slate-700">{prod.name}</span>
                    <span className="text-[9px] font-medium px-1.5 py-0.2 bg-rose-100 text-rose-700 rounded border border-rose-200">
                      Flagged: {prod.details}
                    </span>
                  </div>
                ))}
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-normal">
                Audit Date: {dayjs(expiredModal.shopData.auditDate).format('DD MMM YYYY')}
              </span>
              <button
                onClick={() => setExpiredModal({ isOpen: false, shopData: null })}
                className="px-3.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-xs font-medium transition-colors shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
