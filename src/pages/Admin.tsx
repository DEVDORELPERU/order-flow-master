import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { generateCSVTemplate, downloadCSV, parseCSVToOrders } from "@/lib/csvUtils";
import { Order } from "@/data/types";
import { Download, Upload, FileSpreadsheet, ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Admin = () => {
  const [importedOrders, setImportedOrders] = useState<Order[]>([]);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    const csv = generateCSVTemplate();
    downloadCSV(csv, "plantilla_pedidos.csv");
    toast.success("Plantilla descargada con 3 ejemplos incluidos");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const orders = parseCSVToOrders(text);
        if (orders.length === 0) {
          setImportError("No se encontraron pedidos válidos en el archivo.");
          return;
        }
        setImportedOrders(orders);
        toast.success(`${orders.length} pedidos importados correctamente`);
      } catch {
        setImportError("Error al procesar el archivo CSV. Verifica el formato.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Dashboard</span>
          </Link>
          <div className="w-px h-6 bg-border" />
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-base font-bold tracking-tight">Administración</h1>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
        {/* Download Template */}
        <section className="bg-card rounded-lg border p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Download className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-1">Descargar Plantilla CSV</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Descarga la plantilla con las cabeceras correctas y 3 líneas de ejemplo con distintos estados, canales, cantidades y datos de seguimiento. 
                Complétala externamente y luego impórtala.
              </p>
              <Button onClick={handleDownloadTemplate} className="gap-2">
                <Download className="w-4 h-4" />
                Descargar Plantilla
              </Button>
            </div>
          </div>
        </section>

        {/* Upload CSV */}
        <section className="bg-card rounded-lg border p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Upload className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-1">Importar Pedidos</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Sube un archivo CSV con el formato de la plantilla para cargar pedidos masivamente al sistema.
              </p>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="gap-2" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4" />
                  Seleccionar Archivo CSV
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              {importError && (
                <div className="mt-4 flex items-center gap-2 text-sm text-destructive bg-red-50 border border-red-200 rounded-lg p-3">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {importError}
                </div>
              )}

              {importedOrders.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    {importedOrders.length} pedidos importados correctamente
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 font-semibold text-xs uppercase tracking-wider">ID</th>
                          <th className="text-left p-3 font-semibold text-xs uppercase tracking-wider">Cliente</th>
                          <th className="text-left p-3 font-semibold text-xs uppercase tracking-wider">Canal</th>
                          <th className="text-left p-3 font-semibold text-xs uppercase tracking-wider">Estado</th>
                          <th className="text-right p-3 font-semibold text-xs uppercase tracking-wider">Total</th>
                          <th className="text-left p-3 font-semibold text-xs uppercase tracking-wider">Días Est.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importedOrders.map((o) => (
                          <tr key={o.id} className="border-t">
                            <td className="p-3 font-mono">{o.id}</td>
                            <td className="p-3">{o.customer.name}</td>
                            <td className="p-3 capitalize">{o.channel.replace(/_/g, " ")}</td>
                            <td className="p-3 capitalize">{o.status.replace(/_/g, " ")}</td>
                            <td className="p-3 text-right font-mono">${o.total.toLocaleString("es-CL")}</td>
                            <td className="p-3">{o.estimatedDays || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CSV Format Reference */}
        <section className="bg-card rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-3">Referencia de Formato</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium mb-2 text-muted-foreground">Canales válidos</h3>
              <code className="text-xs bg-muted p-2 rounded block">ecommerce, marketplace, store, call_center</code>
            </div>
            <div>
              <h3 className="font-medium mb-2 text-muted-foreground">Estados válidos</h3>
              <code className="text-xs bg-muted p-2 rounded block">pending, confirmed, on_hold, preparing, ready, in_transit, delivered, incident, closed, returned, rejected</code>
            </div>
            <div>
              <h3 className="font-medium mb-2 text-muted-foreground">Múltiples productos</h3>
              <code className="text-xs bg-muted p-2 rounded block">Separar con punto y coma (;) en productName, productSku, productQty, productPrice</code>
            </div>
            <div>
              <h3 className="font-medium mb-2 text-muted-foreground">Fechas</h3>
              <code className="text-xs bg-muted p-2 rounded block">Formato ISO 8601: 2026-01-25T23:59:00Z</code>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Admin;
