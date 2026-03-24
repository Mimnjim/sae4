// Séparateur réutilisable entre sections
// Usage : <SectionSeparator />

export default function SectionSeparator() {
    return (
        <div style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            // padding:        '0 5%',
            width:          '100%',
            boxSizing:      'border-box',
            background:      '#000',
        }}>
            {/* Ligne gauche */}
            <div style={{
                flex:       1,
                height:     '1px',
                background: 'rgba(255, 255, 255, 0.3)',
            }} />

            {/* Point rouge lumineux */}
            <div style={{
                width:        '6px',
                height:       '6px',
                borderRadius: '50%',
                // background:   'rgba(186, 18, 27, 0.8)',
                // boxShadow:    '0 0 14px rgba(186, 18, 27, 0.7), 0 0 28px rgba(186, 18, 27, 0.3)',
                background:   'rgba(255, 255, 255, 0.8)',
                boxShadow:    '0 0 14px rgba(255, 255, 255, 0.8)',
                
                margin:       '0 24px',
                flexShrink:   0,
            }} />

            {/* Ligne droite */}
            <div style={{
                flex:       1,
                height:     '1px',
                background: 'rgba(255, 255, 255, 0.3)',
            }} />
        </div>
    );
}
