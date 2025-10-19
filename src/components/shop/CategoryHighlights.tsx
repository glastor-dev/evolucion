import React from "react";
import { motion } from "framer-motion";
import { Drill, Wrench, Layers, Zap } from "lucide-react";

interface Category {
  slug: string;
  title: string;
  image?: string;
  Icon?: React.ComponentType<{ className?: string }>;
}

interface Props {
  categories?: Category[];
  onClickCategory?: (slug: string) => void;
}

const defaultCategories: Category[] = [
  { slug: "taladros", title: "Taladros", Icon: Drill },
  { slug: "sierras", title: "Sierras", Icon: Wrench },
  { slug: "lijadoras", title: "Lijadoras", Icon: Layers },
  { slug: "amoladoras", title: "Amoladoras", Icon: Zap },
];

export const CategoryHighlights: React.FC<Props> = ({ categories = defaultCategories, onClickCategory }) => {
  console.log("CategoryHighlights rendering");

  return (
    <section className="relative py-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(({ slug, title, Icon }, i) => (
            <motion.button
              key={slug}
              onClick={() => onClickCategory?.(slug)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="relative p-5 rounded-2xl bg-slate-900/70 border border-slate-700/60 text-left hover:border-emerald-500/40 hover:bg-slate-900/80 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center">
                  {Icon ? <Icon className="w-6 h-6 text-black" /> : <span className="text-black font-bold">{title[0]}</span>}
                </div>
                <div>
                  <h3 className="text-white font-extrabold text-lg">{title}</h3>
                  <p className="text-emerald-200/70 text-xs">Explorar {title.toLowerCase()}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};
