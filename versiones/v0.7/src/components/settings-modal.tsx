export function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full text-white">
        <h3 className="font-bold text-lg mb-2">Configuración</h3>
        <p className="text-zinc-400 text-sm mb-4">Los ajustes completos de cuenta y temas se integran en la versión 0.8.</p>
        <button onClick={onClose} className="px-4 py-2 bg-emerald-500 rounded-lg text-white font-medium text-sm">Cerrar</button>
      </div>
    </div>
  );
}
