import React from 'react';
import { WeaponId } from '../types/game';
import { WEAPON_CONFIGS } from '../procedural/weapons';

interface BuyMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onBuyWeapon: (weaponId: WeaponId) => void;
  onRestartPistolRound: () => void;
}

export const BuyMenu: React.FC<BuyMenuProps> = ({
  isOpen,
  onClose,
  onBuyWeapon,
  onRestartPistolRound,
}) => {
  if (!isOpen) return null;

  const weapons: WeaponId[] = ['ak47', 'm4a4', 'awp', 'deagle', 'usp', 'glock'];

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(7, 10, 15, 0.78)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div
        style={{
          width: '780px',
          maxHeight: '85vh',
          backgroundColor: '#121721',
          border: '1px solid #2d3748',
          borderRadius: '12px',
          padding: '24px',
          color: '#ffffff',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #232d3f',
            paddingBottom: '14px',
            marginBottom: '20px',
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, letterSpacing: '1px' }}>
              WEAPON ARSENAL / BUY MENU
            </h2>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
              Select equipment or start a fresh Pistol Round (Round 1)
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#232d3f',
              border: 'none',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            CLOSE [ESC / B]
          </button>
        </div>

        {/* Pistol Round Quick Action */}
        <div
          style={{
            backgroundColor: 'rgba(234, 179, 8, 0.1)',
            border: '1px solid rgba(234, 179, 8, 0.3)',
            borderRadius: '8px',
            padding: '12px 18px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontWeight: 700, color: '#facc15' }}>ROUND 1: PISTOL ROUND MODE</div>
            <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
              Reset round to standard CS pistol round (pistols only, no rifles, 100 Kevlar).
            </div>
          </div>
          <button
            onClick={() => {
              onRestartPistolRound();
              onClose();
            }}
            style={{
              backgroundColor: '#ca8a04',
              color: '#000',
              fontWeight: 700,
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            START PISTOL ROUND
          </button>
        </div>

        {/* Weapons Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '14px',
          }}
        >
          {weapons.map((wId) => {
            const data = WEAPON_CONFIGS[wId];
            return (
              <div
                key={wId}
                style={{
                  backgroundColor: '#18202d',
                  border: '1px solid #283548',
                  borderRadius: '8px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>{data.name}</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#38bdf8' }}>${data.price}</span>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '6px',
                      fontSize: '12px',
                      color: '#94a3b8',
                      marginTop: '10px',
                    }}
                  >
                    <div>Damage: <span style={{ color: '#fff' }}>{data.damage}</span></div>
                    <div>Headshot: <span style={{ color: '#ef4444' }}>{Math.round(data.damage * data.headshotMultiplier)}</span></div>
                    <div>Fire Rate: <span style={{ color: '#fff' }}>{data.fireRate} r/s</span></div>
                    <div>Mag Size: <span style={{ color: '#fff' }}>{data.magazineSize} rds</span></div>
                    <div>Armor Pen: <span style={{ color: '#fff' }}>{Math.round(data.armorPenetration * 100)}%</span></div>
                    <div>Type: <span style={{ color: '#e2e8f0' }}>{data.automatic ? 'Full Auto' : (data.scoped ? 'Sniper / Zoom' : 'Semi Auto')}</span></div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onBuyWeapon(wId);
                    onClose();
                  }}
                  style={{
                    marginTop: '12px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '13px',
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
                >
                  EQUIP {data.name.toUpperCase()}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
