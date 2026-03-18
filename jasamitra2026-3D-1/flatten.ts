import fs from 'fs';
import path from 'path';

function flattenDirectory(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      flattenDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      
      // Replace 3D shadows and drop-shadows
      content = content.replace(/shadow-\[[^\]]+\]/g, 'shadow-sm');
      content = content.replace(/drop-shadow-\[[^\]]+\]/g, '');
      
      // Replace large tailwind shadows
      content = content.replace(/shadow-(md|lg|xl|2xl|inner|premium|glass|3d)/g, 'shadow-sm');
      content = content.replace(/drop-shadow-(sm|md|lg|xl|2xl)/g, '');
      
      // Remove colored shadows (e.g., shadow-primary/30)
      content = content.replace(/shadow-[a-z0-9-]+\/[0-9]+/g, '');
      
      // Replace glassmorphism backgrounds
      content = content.replace(/bg-white\/(50|80|90)/g, 'bg-white');
      content = content.replace(/backdrop-blur-(sm|md|lg|xl|2xl|3xl)/g, '');
      
      // Replace glassmorphism borders
      content = content.replace(/border-white\/(5|10|20|40|50|80)/g, 'border-slate-200');
      
      // Replace gradients with solid colors
      content = content.replace(/bg-gradient-to-[a-z]+ from-primary to-accent/g, 'bg-primary');
      content = content.replace(/bg-gradient-to-[a-z]+ from-primary to-blue-[0-9]+/g, 'bg-primary');
      content = content.replace(/bg-gradient-to-[a-z]+ from-accent to-orange-[0-9]+/g, 'bg-accent');
      content = content.replace(/bg-gradient-to-[a-z]+ from-emerald-[0-9]+ to-emerald-[0-9]+/g, 'bg-emerald-500');
      content = content.replace(/bg-gradient-to-[a-z]+ from-white\/80 to-white\/50/g, 'bg-white');
      content = content.replace(/bg-gradient-to-[a-z]+ from-white to-slate-100/g, 'bg-white');
      
      // Remove 3D transform utility if it exists
      content = content.replace(/transform-style-3d/g, '');
      content = content.replace(/neo-3d/g, '');
      
      // Clean up multiple spaces that might have been left
      content = content.replace(/  +/g, ' ');
      
      fs.writeFileSync(fullPath, content, 'utf-8');
    }
  }
}

flattenDirectory(path.join(process.cwd(), 'src'));
console.log('Flattening complete!');
