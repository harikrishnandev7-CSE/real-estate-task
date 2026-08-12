import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText, Tag } from 'lucide-react';

const QuickQuestions = ({ questions = [], onSelectQuestion }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {questions.map((question, index) => {
        const Icon = question.toLowerCase().includes('visit') ? Calendar
                   : question.toLowerCase().includes('details') ? FileText
                   : question.toLowerCase().includes('pricing') ? Tag : null;
        return (
          <motion.button
            key={index}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.16 }}
            type="button"
            onClick={() => onSelectQuestion(question)}
            style={{
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              padding: '0 14px',
              borderRadius: 6,
              border: '1px solid rgba(201,169,110,0.22)',
              background: 'rgba(201,169,110,0.06)',
              color: 'rgba(201,169,110,0.80)',
              cursor: 'pointer',
              outline: 'none',
              transition: 'background 0.18s, border 0.18s, color 0.18s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(201,169,110,0.14)';
              e.currentTarget.style.borderColor = 'rgba(201,169,110,0.5)';
              e.currentTarget.style.color = '#C9A96E';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(201,169,110,0.06)';
              e.currentTarget.style.borderColor = 'rgba(201,169,110,0.22)';
              e.currentTarget.style.color = 'rgba(201,169,110,0.80)';
            }}
          >
            {Icon && <Icon style={{ width: 13, height: 13, color: '#C9A96E', strokeWidth: 2 }} />}
            {question}
          </motion.button>
        );
      })}
    </div>
  );
};

export default QuickQuestions;
