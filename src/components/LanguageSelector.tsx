import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useFlowStore } from '../store';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '/flags/us.svg' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '/flags/tr.svg' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '/flags/de.svg' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '/flags/fr.svg' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '/flags/es.svg' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '/flags/cn.svg' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '/flags/jp.svg' },
];

interface LanguageSelectorProps {
  variant?: 'default' | 'compact' | 'minimal';
  placement?: 'top' | 'bottom';
}

// --- Shared dropdown list (rendered by all 3 variants) ---
interface LanguageDropdownProps {
  isOpen: boolean;
  placement: 'top' | 'bottom';
  currentCode: string;
  onSelect: (code: string) => void;
  onClose: () => void;
  width?: string;
}

function LanguageDropdown({
  isOpen,
  placement,
  currentCode,
  onSelect,
  onClose,
  width = 'w-44',
}: LanguageDropdownProps): React.JSX.Element | null {
  if (!isOpen) return null;

  const positionClass = placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2';
  const originClass = placement === 'top' ? 'origin-bottom-right' : 'origin-top-right';

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className={`absolute right-0 ${positionClass} ${width} bg-white/95 backdrop-blur-xl rounded-lg shadow-xl border border-slate-200 ring-1 ring-black/5 p-1 z-50 animate-in fade-in zoom-in-95 duration-200 ${originClass}`}
      >
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onSelect(lang.code)}
            className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium transition-all ${currentCode === lang.code
                ? 'bg-[var(--brand-primary-50)] text-[var(--brand-primary)]'
                : 'text-slate-600 hover:bg-slate-50'
              }`}
          >
            <div className="flex items-center gap-2">
              <img src={lang.flag} alt={lang.name} className="w-5 h-3.5 object-cover rounded-[2px]" />
              <span>{lang.nativeName}</span>
            </div>
            {currentCode === lang.code && <Check className="w-4 h-4" />}
          </button>
        ))}
      </div>
    </>
  );
}

// --- Main component ---
export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'default',
  placement = 'bottom',
}) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);
  const { setViewSettings } = useFlowStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams();

  const currentLanguage = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  async function changeLanguage(code: string): Promise<void> {
    await i18n.changeLanguage(code);
    setViewSettings({ language: code });

    if (location.pathname.startsWith('/docs') && slug) {
      navigate(`/docs/${code}/${slug}`, { replace: true });
    }

    setIsOpen(false);
  }

  const chevronClass = `transition-transform ${isOpen
      ? placement === 'top' ? '' : 'rotate-180'
      : placement === 'top' ? 'rotate-180' : ''
    }`;

  if (variant === 'compact') {
    return (
      <div className="relative w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-3 py-2 rounded-lg border border-slate-200 transition-all text-sm font-medium bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300"
        >
          <div className="flex items-center gap-2">
            <img src={currentLanguage.flag} alt={currentLanguage.name} className="w-5 h-3.5 object-cover rounded-[2px]" />
            <span>{currentLanguage.nativeName}</span>
          </div>
          <ChevronDown className={`w-4 h-4 ${chevronClass}`} />
        </button>
        <LanguageDropdown
          isOpen={isOpen}
          placement={placement}
          currentCode={i18n.language}
          onSelect={changeLanguage}
          onClose={() => setIsOpen(false)}
          width="w-full"
        />
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-md transition-all text-sm font-medium bg-transparent text-slate-600 hover:bg-slate-100"
          title="Change Language"
        >
          <img src={currentLanguage.flag} alt={currentLanguage.name} className="w-5 h-3.5 object-cover rounded-[2px]" />
          <ChevronDown className={`w-3 h-3 ${chevronClass}`} />
        </button>
        <LanguageDropdown
          isOpen={isOpen}
          placement={placement}
          currentCode={i18n.language}
          onSelect={changeLanguage}
          onClose={() => setIsOpen(false)}
          width="w-40"
        />
      </div>
    );
  }

  // Default variant
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] border transition-all text-sm font-medium bg-white border-slate-200 text-slate-600 hover:border-slate-300 shadow-sm hover:shadow"
        title="Change Language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">
          <img src={currentLanguage.flag} alt={currentLanguage.name} className="inline w-5 h-3.5 object-cover rounded-[2px] mr-1.5" />
          {currentLanguage.nativeName}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 ${chevronClass}`} />
      </button>
      <LanguageDropdown
        isOpen={isOpen}
        placement={placement}
        currentCode={i18n.language}
        onSelect={changeLanguage}
        onClose={() => setIsOpen(false)}
        width="w-48"
      />
    </div>
  );
};
