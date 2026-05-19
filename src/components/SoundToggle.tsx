import React from 'react';
import { motion } from 'framer-motion';
import { Volume2Icon, VolumeXIcon } from 'lucide-react';
type Props = {
  enabled: boolean;
  onToggle: () => void;
};
export function SoundToggle({ enabled, onToggle }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileHover={{
        scale: 1.05
      }}
      whileTap={{
        scale: 0.95
      }}
      aria-label={enabled ? 'Mute sounds' : 'Unmute sounds'}
      title={enabled ? 'Mute sounds' : 'Unmute sounds'}
      className={`flex items-center justify-center w-12 h-12 rounded-2xl border-2 backdrop-blur-md transition ${enabled ? 'bg-amber-500/20 border-amber-400/50 text-amber-300' : 'bg-white/5 border-white/20 text-white/50'}`}>
      
      {enabled ? <Volume2Icon size={20} /> : <VolumeXIcon size={20} />}
    </motion.button>);

}