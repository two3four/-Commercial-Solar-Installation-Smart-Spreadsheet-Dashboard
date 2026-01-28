import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    LayoutDashboard,
    Plus,
    Mail,
    Phone,
    Ruler,
    Zap,
    Building2,
    Trash2,
    ExternalLink,
    ChevronRight,
    Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROJECT_RULES } from './constants';
import {
    calculateUsableArea,
    calculateSolarCapacityWatts,
    toKW,
    toMW,
    isValidRoofSize
} from './utils/calculations';
import { downloadPropertyCSV } from './utils/export';

const Dashboard = () => {
    const [properties, setProperties] = useState(() => {
        const saved = localStorage.getItem('solar_properties');
        return saved ? JSON.parse(saved) : [];
    });

    const [activePropertyId, setActivePropertyId] = useState(null);
    const [errors, setErrors] = useState({});

    const [newProperty, setNewProperty] = useState({
        address: '',
        zip: '',
        roofArea: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        localStorage.setItem('solar_properties', JSON.stringify(properties));
    }, [properties]);

    const handleAddProperty = (e) => {
        e.preventDefault();

        // Validation
        const roofAreaNum = parseFloat(newProperty.roofArea);
        if (!isValidRoofSize(roofAreaNum)) {
            setErrors({ roofArea: `Roof size must be between ${PROJECT_RULES.MIN_ROOF_SIZE.toLocaleString()} and ${PROJECT_RULES.MAX_ROOF_SIZE.toLocaleString()} sq ft.` });
            return;
        }

        const usableArea = calculateUsableArea(roofAreaNum);
        const capacityWatts = calculateSolarCapacityWatts(usableArea);

        const property = {
            ...newProperty,
            id: Date.now().toString(),
            roofArea: roofAreaNum,
            usableArea,
            capacityWatts,
            capacityKW: toKW(capacityWatts),
            capacityMW: toMW(capacityWatts),
            timestamp: new Date().toISOString()
        };

        setProperties([property, ...properties]);
        setNewProperty({ address: '', zip: '', roofArea: '', email: '', phone: '' });
        setErrors({});
    };

    const deleteProperty = (id) => {
        setProperties(properties.filter(p => p.id !== id));
        if (activePropertyId === id) setActivePropertyId(null);
    };

    const totalCapacityWatts = properties.reduce((acc, p) => acc + p.capacityWatts, 0);

    return (
        <div className="app-container">
            {/* Header / Top Bar */}
            <header style={{ padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Zap size={28} /> SOLAR HARVEST DASHBOARD
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>Commercial Solar Installation Management</p>
                </div>

                <div style={{ display: 'flex', gap: '24px' }}>
                    <div className="glass-panel" style={{ padding: '12px 24px', textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Portfolio</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)' }}>{toMW(totalCapacityWatts).toFixed(2)} MW</div>
                    </div>
                    <div className="glass-panel" style={{ padding: '12px 24px', textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Projects</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{properties.length}</div>
                    </div>
                </div>
            </header>

            <main style={{ flex: 1, padding: '40px', display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>

                {/* Left Side: Property Table and Rules */}
                <section style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                    {/* Rules Banner */}
                    <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(251, 191, 36, 0.05)', borderColor: 'rgba(251, 191, 36, 0.2)' }}>
                        <div>
                            <h3 style={{ fontSize: '1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Info size={18} color="var(--primary)" /> Project Assumptions
                            </h3>
                            <div style={{ display: 'flex', gap: '40px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                <span>• Commercial Only</span>
                                <span>• Size: {PROJECT_RULES.MIN_ROOF_SIZE.toLocaleString()} - {PROJECT_RULES.MAX_ROOF_SIZE.toLocaleString()} sq ft</span>
                                <span>• Usable Area: {PROJECT_RULES.USABLE_AREA_PERCENTAGE * 100}%</span>
                                <span>• Power: {PROJECT_RULES.POWER_DENSITY_W_PER_SQFT} W/sq ft</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ overflow: 'hidden' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Property Data Entry</h2>
                        </div>

                        <table className="data-grid">
                            <thead>
                                <tr>
                                    <th>ADDRESS</th>
                                    <th>ZIP</th>
                                    <th>ROOF AREA (SQ FT)</th>
                                    <th>EMAIL</th>
                                    <th>CAPACITY</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {properties.map((p) => (
                                        <motion.tr
                                            key={p.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            style={{
                                                cursor: 'pointer',
                                                background: activePropertyId === p.id ? 'rgba(255, 255, 255, 0.05)' : 'transparent'
                                            }}
                                            onClick={() => setActivePropertyId(p.id)}
                                        >
                                            <td>{p.address}</td>
                                            <td>{p.zip}</td>
                                            <td style={{ fontWeight: '600' }}>{p.roofArea.toLocaleString()}</td>
                                            <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{p.email}</td>
                                            <td style={{ color: 'var(--primary)', fontWeight: '700' }}>{p.capacityKW.toFixed(1)} kW</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '12px' }}>
                                                    <button
                                                        className="premium-btn"
                                                        style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                                                        onClick={(e) => { e.stopPropagation(); setActivePropertyId(p.id); }}
                                                    >
                                                        <ChevronRight size={14} /> View Details
                                                    </button>
                                                    <button
                                                        style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer' }}
                                                        onClick={(e) => { e.stopPropagation(); deleteProperty(p.id); }}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                                {properties.length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                                            No properties added yet. Use the form on the right to start.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Right Side: Add Property Form */}
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="glass-panel" style={{ padding: '32px' }}>
                        <h3 style={{ fontSize: '1.125rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Plus size={20} color="var(--primary)" /> New Property
                        </h3>
                        <form onSubmit={handleAddProperty} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Property Address</label>
                                <input
                                    required
                                    className="input-field"
                                    placeholder="123 Solar St"
                                    value={newProperty.address}
                                    onChange={e => setNewProperty({ ...newProperty, address: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Zip Code</label>
                                    <input
                                        required
                                        className="input-field"
                                        placeholder="90210"
                                        value={newProperty.zip}
                                        onChange={e => setNewProperty({ ...newProperty, zip: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Roof Area (sq ft)</label>
                                    <input
                                        required
                                        type="number"
                                        className={`input-field ${errors.roofArea ? 'error' : ''}`}
                                        placeholder="50000"
                                        value={newProperty.roofArea}
                                        onChange={e => setNewProperty({ ...newProperty, roofArea: e.target.value })}
                                    />
                                </div>
                            </div>
                            {errors.roofArea && <div style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '-8px' }}>{errors.roofArea}</div>}

                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Management Email</label>
                                <input
                                    required
                                    type="email"
                                    className="input-field"
                                    placeholder="owner@example.com"
                                    value={newProperty.email}
                                    onChange={e => setNewProperty({ ...newProperty, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Phone Number</label>
                                <input
                                    required
                                    className="input-field"
                                    placeholder="(555) 000-0000"
                                    value={newProperty.phone}
                                    onChange={e => setNewProperty({ ...newProperty, phone: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="premium-btn" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
                                Add to Dashboard
                            </button>
                        </form>
                    </div>

                    {/* Sub-sheet View (Conditional Overlay/Section) */}
                    <AnimatePresence>
                        {activePropertyId && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="glass-panel"
                                style={{
                                    padding: '32px',
                                    border: '1px solid var(--primary)',
                                    boxShadow: '0 0 40px rgba(251, 191, 36, 0.15)'
                                }}
                            >
                                {(() => {
                                    const p = properties.find(prop => prop.id === activePropertyId);
                                    if (!p) return null;
                                    return (
                                        <>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                                                <div>
                                                    <h3 style={{ fontSize: '1.25rem' }}>Property Report</h3>
                                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{p.address}</p>
                                                </div>
                                                <button
                                                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                                                    onClick={() => setActivePropertyId(null)}
                                                >
                                                    ✕
                                                </button>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                                    <Metric label="Usable Area" value={`${p.usableArea.toLocaleString()} ft²`} icon={<Ruler size={16} />} />
                                                    <Metric label="Total Capacity" value={`${p.capacityKW.toFixed(1)} kW`} icon={<Zap size={16} />} />
                                                </div>

                                                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                                                    <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px' }}>Contact Details</h4>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.875rem' }}>
                                                            <Mail size={16} color="var(--primary)" /> {p.email}
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.875rem' }}>
                                                            <Phone size={16} color="var(--primary)" /> {p.phone}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', gap: '12px' }}>
                                                    <button
                                                        className="premium-btn"
                                                        style={{ flex: 1, background: 'rgba(15, 23, 42, 0.5)', border: '1px solid var(--border)', color: 'var(--text-main)', justifyContent: 'center' }}
                                                        onClick={() => downloadPropertyCSV(p)}
                                                    >
                                                        Download XLSX
                                                    </button>
                                                    <button className="premium-btn" style={{ flex: 1, justifyContent: 'center' }}>
                                                        Contact Lead
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })()}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </aside>
            </main>
        </div>
    );
};

const Metric = ({ label, value, icon }) => (
    <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '8px', textTransform: 'uppercase' }}>
            {icon} {label}
        </div>
        <div style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-main)' }}>{value}</div>
    </div>
);

export default Dashboard;
