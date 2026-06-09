import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(useGSAP, ScrollTrigger, TextPlugin, SplitText)

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const hasFinePointer = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches

export { gsap, useGSAP, ScrollTrigger, SplitText }
