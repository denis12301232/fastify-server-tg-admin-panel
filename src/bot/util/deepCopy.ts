import type { AnyObject } from '@/types/interfaces'


export function deepCopy<T = any[] | AnyObject>(target: any[] | AnyObject): T {
   if (Array.isArray(target)) {
      return target.reduce((box, item) => {
         if (Array.isArray(item) || typeof item === 'object') {
            return [...box, deepCopy(item)];
         } else {
            return [...box, item];
         }
      }, []);
   } else {
      return Object.entries(target).reduce((box, [key, value]) => {
         if (Array.isArray(value) || typeof value === 'object') {
            return { ...box, [key]: deepCopy(value) };
         } else {
            return { ...box, [key]: value }
         }
      }, {} as T);
   }
}