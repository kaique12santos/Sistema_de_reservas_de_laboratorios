import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Box, IconButton,
  FormGroup, FormControlLabel, Checkbox, Typography,
  Grid, Divider
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const EQUIPAMENTOS_PADRAO = [
  "Ar-condicionado",
  "Projetor",
  "Computadores",
  "Notebooks",
  "Lousa",
  "Televisão",
  "Caixas de Som",
  "Ventiladores",
  "Microfones",
  "Passador de Slides",

];

const LaboratoryFormModal = ({ open, onClose, onSave, initialData }) => {
  const [step, setStep] = useState(1); // 1: Básico, 2: Quantidades
  const [formData, setFormData] = useState({ name: "", location: "", capacity: "", type: "", description: "" });
  const [selectedEquipments, setSelectedEquipments] = useState([]);
  const [quantities, setQuantities] = useState({}); // { "Computadores": "30" }
  const [errors, setErrors] = useState({});

  // 🚀 PARSER: Transforma a string do banco em Checkboxes e Números
  useEffect(() => {
    if (open) {
      if (initialData) {
        let text = initialData.description_lab || initialData.description || "";
        const qMap = {};
        const selected = [];

        // Regex para pegar "30x Computadores"
        const matches = text.matchAll(/(\d+)x\s([^,\]\n]+)/g);
        for (const match of matches) {
          const qty = match[1];
          const name = match[2].trim();
          qMap[name] = qty;
          selected.push(name);
        }

        // Limpa a tag do texto para sobrar só a descrição pura
        const pureDesc = text.replace(/\[Equipamentos:.*?\]/s, "").trim();

        setFormData({ ...initialData, description: pureDesc });
        setSelectedEquipments(selected);
        setQuantities(qMap);
      } else {
        resetForm();
      }
      setStep(1);
      setErrors({});
    }
  }, [open, initialData]);

  const resetForm = () => {
    setFormData({ name: "", location: "", capacity: "", type: "", description: "" });
    setSelectedEquipments([]);
    setQuantities({});
  };

  const handleToggleEquipment = (eq) => {
    setSelectedEquipments(prev => {
      const isSelected = prev.includes(eq);
      if (isSelected) {
        const next = prev.filter(i => i !== eq);
        const nextQ = { ...quantities };
        delete nextQ[eq];
        setQuantities(nextQ);
        return next;
      }
      return [...prev, eq];
    });
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Obrigatório";
    if (!formData.type) newErrors.type = "Obrigatório";
    if (!formData.capacity || Number(formData.capacity) <= 0) newErrors.capacity = "Inválida";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (!validateStep1()) return;
    
    // Se não marcou nenhum equipamento, salva direto
    if (selectedEquipments.length === 0) {
      finalSubmit("");
    } else {
      setStep(2);
    }
  };

  const finalSubmit = (equipString = null) => {
    let eqTag = equipString;
    
    if (eqTag === null) {
      const parts = selectedEquipments.map(eq => `${quantities[eq] || 1}x ${eq}`);
      eqTag = parts.length > 0 ? `[Equipamentos: ${parts.join(", ")}]` : "";
    }

    const finalDescription = formData.description.trim() 
      ? `${formData.description.trim()}\n\n${eqTag}`.trim() 
      : eqTag;

    onSave({ 
      ...formData, 
      capacity: Number(formData.capacity),
      description: finalDescription 
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {step === 2 && (
            <IconButton onClick={() => setStep(1)} size="small"><ArrowBackIcon /></IconButton>
          )}
          {initialData ? "Editar Laboratório" : "Novo Laboratório"}
        </Box>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {step === 1 ? (
          /* PASSO 1: DADOS BÁSICOS E SELEÇÃO */
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField label="Nome do Laboratório" fullWidth value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} error={!!errors.name} helperText={errors.name} />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField label="Localização" fullWidth value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
              <TextField label="Capacidade" type="number" sx={{ minWidth: 150 }} value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: e.target.value })} error={!!errors.capacity} helperText={errors.capacity} />
            </Box>
            <TextField select label="Tipo" fullWidth value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} error={!!errors.type} helperText={errors.type}>
              <MenuItem value="LABORATORIO">Laboratório</MenuItem>
              <MenuItem value="SALA DE AULA">Sala de Aula</MenuItem>
              <MenuItem value="AUDITORIO">Auditório</MenuItem>
            </TextField>
            
            <Typography variant="subtitle2" sx={{ mt: 1, color: 'text.secondary' }}>Marque os equipamentos disponíveis:</Typography>
            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid #eee' }}>
              <FormGroup row>
                {EQUIPAMENTOS_PADRAO.map(eq => (
                  <FormControlLabel key={eq} control={<Checkbox size="small" checked={selectedEquipments.includes(eq)} onChange={() => handleToggleEquipment(eq)} />} label={<Typography variant="body2">{eq}</Typography>} />
                ))}
              </FormGroup>
            </Box>
            <TextField label="Descrição Adicional" fullWidth multiline rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          </Box>
        ) : (
          /* PASSO 2: ESPECIFICAR QUANTIDADES */
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Especifique a quantidade para cada item selecionado:
            </Typography>
            <Grid container spacing={2}>
              {selectedEquipments.map(eq => (
                <Grid item xs={12} sm={6} key={eq} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TextField
                    label={eq}
                    type="number"
                    size="small"
                    value={quantities[eq] || ""}
                    onChange={e => setQuantities({ ...quantities, [eq]: e.target.value })}
                    placeholder="Ex: 30"
                    fullWidth
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button 
          variant="contained" 
          onClick={step === 1 ? handleNextStep : () => finalSubmit()}
        >
          {step === 1 ? (selectedEquipments.length > 0 ? "Próximo: Quantidades" : "Salvar") : "Finalizar e Salvar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LaboratoryFormModal;