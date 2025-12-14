import { useEffect, useState } from 'react';
import { Plus, AlertTriangle, ShieldAlert, TrendingUp, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RiskCard } from '@/general/components/risks/RiskCard';
import { RiskDetailModal } from '@/general/components/risks/RiskDetailModal';
import { AddRiskModal } from '@/general/components/risks/AddRiskModal';
import { riskService, type Risk } from '@/api/riskService';
import { CustomPageHeader } from "@/general/components/CustomPageHeader";

export const Risks = () => {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    loadRisks();
  }, []);

  const loadRisks = async () => {
    const data = await riskService.getAll();
    setRisks(data);
  };

  const handleAddRisk = (newRisk: Risk) => {
    setRisks(prev => [...prev, newRisk]);
  };

  const handleCardClick = (risk: Risk) => {
    setSelectedRisk(risk);
    setIsDetailOpen(true);
  };

  const handleUpdateRisk = (updated: Risk) => {
  setRisks((prev) =>
    prev.map((r) => (r.id === updated.id ? updated : r))
  );
};

  const criticalCount = risks.filter(r => r.level === 'Crítico').length;
  const highCount = risks.filter(r => r.level === 'Alto').length;
  const mediumCount = risks.filter(r => r.level === 'Medio').length;

  return (
    <div className="min-h-screen">
          <CustomPageHeader
            title="Gestión de Riesgos"
            description="Identificación y seguimiento de riesgos empresariales"
            action={
              <Button className="gap-2 bg-indigo-800" onClick={() => setIsAddOpen(true)}>
                <Plus className="h-4 w-4" />
                Nuevo Riesgo
              </Button>
            }
          />

      {/* Stats */}
      <div className="container mx-auto px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-fade-in">
        <div className="bg-card rounded-lg border border-border p-5">
          <span className="text-sm text-muted-foreground">Total Riesgos</span>
          <p className="text-3xl font-bold mt-2">{risks.length}</p>
        </div>

        <div className="bg-red-50 rounded-lg border border-red-200 p-5">
          <span className="text-sm text-red-700">Críticos</span>
          <p className="text-3xl font-bold text-red-700 mt-2">{criticalCount}</p>
        </div>

        <div className="bg-orange-50 rounded-lg border border-orange-200 p-5">
          <span className="text-sm text-orange-700">Altos</span>
          <p className="text-3xl font-bold text-orange-700 mt-2">{highCount}</p>
        </div>

        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-5">
          <span className="text-sm text-yellow-700">Medios</span>
          <p className="text-3xl font-bold text-yellow-700 mt-2">{mediumCount}</p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {risks.map(risk => (
          <RiskCard
            key={risk.id}
            risk={risk}
            onClick={() => handleCardClick(risk)}
          />
        ))}
      </div>

      <RiskDetailModal
        risk={selectedRisk}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onUpdated={handleUpdateRisk}
      />

      <AddRiskModal
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onAdd={handleAddRisk}
      />
    </div>
    </div>
  );
}
