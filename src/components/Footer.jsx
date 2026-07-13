import { motion } from 'motion/react'
import FadeIn from './ui/FadeIn'

const GITHUB_SVG = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

export default function Footer() {
  return (
    <footer className="w-full border-t border-[rgba(255,107,53,0.1)] bg-[linear-gradient(to_bottom,rgba(10,10,11,0.4),rgba(10,10,11,0.9))] backdrop-blur-[20px] relative z-10">
      <FadeIn scale={false}>
        <div className="mx-auto max-w-[1280px] px-6 py-12 flex flex-col gap-10">
          
          {/* Main Footer Content */}
          <div className="flex flex-row flex-wrap justify-between items-center gap-6">
            
            {/* Logo & Tagline */}
            <div className="flex flex-col gap-3">
              <span className="font-display text-[24px] font-extrabold tracking-tight">
                <span className="text-[var(--color-accent)]">Hook</span><span className="text-white">lane</span>
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-[rgba(200,198,203,0.7)] text-sm font-body m-0">
                  Prove your fandom. Guess the song.
                </p>
                <p className="text-[rgba(200,198,203,0.5)] text-xs font-body m-0">
                  Designed & Built by{' '}
                  <a 
                    href="https://github.com/RoyalLit" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white no-underline transition-colors hover:text-[var(--color-accent)]"
                  >
                    Pahul
                  </a>
                </p>
              </div>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-4">
              <motion.a
                href="https://github.com/RoyalLit"
                target="_blank"
                rel="noopener noreferrer"
                title="Pahul's GitHub Profile"
                whileHover={{ scale: 1.1, color: '#fff' }}
                whileTap={{ scale: 0.95 }}
                className="text-[rgba(200,198,203,0.5)] flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] hover:border-white/[0.1] transition-all"
              >
                {GITHUB_SVG}
              </motion.a>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-row flex-wrap justify-between items-center gap-4 pt-6 border-t border-white/[0.05] text-xs text-[rgba(200,198,203,0.4)] font-body">
            <span>&copy; {new Date().getFullYear()} Hooklane. All rights reserved.</span>
            <span>
              Powered by <a href="https://deezer.com" target="_blank" rel="noopener noreferrer" className="text-[rgba(200,198,203,0.6)] no-underline hover:text-[var(--color-accent)] transition-colors">Deezer API</a>
            </span>
          </div>

        </div>
      </FadeIn>
    </footer>
  )
}
