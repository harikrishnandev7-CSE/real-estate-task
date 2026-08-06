import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText, Tag } from 'lucide-react';

const QuickQuestions = ({ questions = [], onSelectQuestion }) => {
  return (
    <div className="flex flex-wrap gap-2.5">
      {questions.map((question, index) => {
        // Mapped icons based on question text content
        const Icon = question.toLowerCase().includes('visit') ? Calendar :
                     question.toLowerCase().includes('details') ? FileText :
                     question.toLowerCase().includes('pricing') ? Tag : null;
        return (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            type="button"
            onClick={() => onSelectQuestion(question)}
            className="h-[40px] flex items-center justify-center gap-2 text-xs font-bold tracking-wider px-4 rounded-full border border-[#E8E4DA] bg-white text-[#8A8A85] hover:text-[#1A1A1A] hover:border-[#F5A623] hover:bg-stone-50 transition-all duration-200 cursor-pointer outline-none shadow-2xs font-sans"
          >
            {Icon && <Icon className="w-3.5 h-3.5 text-[#F5A623] stroke-[2]" />}
            {question}
          </motion.button>
        );
      })}
    </div>
  );
};

export default QuickQuestions;
