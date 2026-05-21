import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUserShield, faDatabase, faScaleBalanced, faEnvelope, faGlobe, faShieldHalved, faUsers } from '@fortawesome/free-solid-svg-icons';
import { useI18nStore } from '../../i18n';

const sections = [
  { key: 'dataCollection', icon: faDatabase },
  { key: 'dataUse', icon: faUsers },
  { key: 'dataSharing', icon: faUserShield },
  { key: 'youthPrivacy', icon: faShieldHalved },
  { key: 'dataSecurity', icon: faLock },
  { key: 'dataRetention', icon: faDatabase },
  { key: 'yourRights', icon: faScaleBalanced },
  { key: 'multiChannel', icon: faGlobe },
];

export default function PrivacyPage() {
  const { t } = useI18nStore();
  const trans = t();
  const p = trans.privacy;

  return (
    <div className="space-y-8 md:space-y-10 max-w-4xl">
      <div className="text-center pb-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-[10px] font-semibold tracking-wide mb-4">
          <FontAwesomeIcon icon={faLock} className="text-[11px]" />
          {p.lastUpdated}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-[-.02em] text-ink-900">
          {p.title}
        </h1>
        <p className="text-sm text-ink-500 mt-2 max-w-2xl mx-auto">
          {p.subtitle}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="prose-sm max-w-none text-ink-700 leading-relaxed bg-white rounded-2xl border border-ink-200/60 p-6 md:p-8"
      >
        <p className="text-sm leading-relaxed">{p.intro}</p>
      </motion.div>

      <div className="space-y-6">
        {sections.map(({ key, icon }, idx) => {
          const data = p[key as keyof typeof p];
          const label = p[`${key}Desc` as keyof typeof p];
          const items = data as unknown as string[] | undefined;
          const desc = label as string | undefined;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-2xl border border-ink-200/60 overflow-hidden"
            >
              <div className="flex items-center gap-3 px-6 py-4 border-b border-ink-100/60 bg-ink-50/30">
                <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                  <FontAwesomeIcon icon={icon} className="text-[15px]" />
                </div>
                <h2 className="text-sm font-bold text-ink-800">
                  {p[key === 'dataCollection' ? 'dataCollection' : key === 'dataUse' ? 'dataUse' : key === 'dataSharing' ? 'dataSharing' : key === 'youthPrivacy' ? 'youthPrivacy' : key === 'dataSecurity' ? 'dataSecurity' : key === 'dataRetention' ? 'dataRetention' : key === 'yourRights' ? 'yourRights' : key === 'multiChannel' ? 'multiChannel' : key]}
                </h2>
              </div>
              <div className="px-6 py-5 space-y-4">
                {desc && <p className="text-sm text-ink-600 leading-relaxed">{desc}</p>}
                {items && Array.isArray(items) && (
                  <ul className="space-y-2.5">
                    {items.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-ink-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl border border-brand-200/60 overflow-hidden"
      >
        <div className="flex items-center gap-3 px-6 py-4 border-b border-brand-100/60 bg-brand-50/40">
          <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white shrink-0">
            <FontAwesomeIcon icon={faEnvelope} className="text-[15px]" />
          </div>
          <h2 className="text-sm font-bold text-ink-800">{p.contact}</h2>
        </div>
        <div className="px-6 py-5 space-y-3">
          <p className="text-sm text-ink-600">{p.contactDesc}</p>
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faEnvelope} className="text-[13px] text-brand-500" />
              <span className="text-ink-800 font-semibold">{p.contactEmail}</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faGlobe} className="text-[13px] text-brand-500" />
              <span className="text-ink-700">{p.contactAddress}</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faLock} className="text-[13px] text-brand-500" />
              <span className="text-ink-700">{p.contactPhone}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}