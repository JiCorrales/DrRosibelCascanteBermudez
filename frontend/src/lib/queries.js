// Hooks de TanStack Query envolviendo lib/api.js. Cada hook hace cache + refetch
// + estado loading/error. El UI usa `data` y `isLoading`; los componentes
// existentes que esperan arrays plano siguen funcionando si pasamos `data ?? []`.

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from './api.js';

const handle = async (call) => {
  const { data, error } = await call;
  if (error) throw error;
  return data;
};

// ─────────────────────────────────────────────
// SERVICIOS
// ─────────────────────────────────────────────
export function useServices({ activeOnly = true } = {}) {
  return useQuery({
    queryKey: ['services', { activeOnly }],
    queryFn: () => handle(api.fetchServices({ activeOnly })),
    staleTime: 1000 * 60 * 5,
  });
}

export function useService(id) {
  return useQuery({
    queryKey: ['services', id],
    queryFn: () => handle(api.fetchService(id)),
    enabled: Boolean(id),
  });
}

export function useUpdateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }) => handle(api.updateService(id, patch)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

// ─────────────────────────────────────────────
// DISPONIBILIDAD
// ─────────────────────────────────────────────
export function useAvailabilityRules() {
  return useQuery({
    queryKey: ['availability', 'rules'],
    queryFn: () => handle(api.fetchAvailabilityRules()),
    staleTime: 1000 * 60 * 10,
  });
}

export function useAvailabilityOverrides() {
  return useQuery({
    queryKey: ['availability', 'overrides'],
    queryFn: () => handle(api.fetchAvailabilityOverrides()),
    staleTime: 1000 * 60 * 10,
  });
}

// Días con slots libres en un rango (YYYY-MM-DD strings)
export function useOpenDays({ from, to, durationMin = 50 }) {
  return useQuery({
    queryKey: ['availability', 'open-days', from, to, durationMin],
    queryFn: () => handle(api.fetchOpenDays({ from, to, durationMin })),
    enabled: Boolean(from && to),
    staleTime: 1000 * 30,
  });
}

// Slots libres para un día específico
export function useSlotsForDay({ date, durationMin = 50 }) {
  return useQuery({
    queryKey: ['availability', 'slots', date, durationMin],
    queryFn: () => handle(api.fetchSlotsForDay({ date, durationMin })),
    enabled: Boolean(date),
    staleTime: 1000 * 30,
  });
}

// ─────────────────────────────────────────────
// RESERVAS
// ─────────────────────────────────────────────
export function useBookings(filters = {}) {
  return useQuery({
    queryKey: ['bookings', filters],
    queryFn: () => handle(api.listBookings(filters)),
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input) => handle(api.createBooking(input)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateBookingStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => handle(api.updateBookingStatus(id, status)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

// ─────────────────────────────────────────────
// CLIENTES
// ─────────────────────────────────────────────
export function useClients(filters = {}) {
  return useQuery({
    queryKey: ['clients', filters],
    queryFn: () => handle(api.listClients(filters)),
  });
}

export function useClient(id) {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => handle(api.fetchClient(id)),
    enabled: Boolean(id),
  });
}

export function useClientBookings(clientId) {
  return useQuery({
    queryKey: ['bookings', { clientId }],
    queryFn: () => handle(api.fetchClientBookings(clientId)),
    enabled: Boolean(clientId),
  });
}

// ─────────────────────────────────────────────
// PORTAL paciente
// ─────────────────────────────────────────────
export function useMyBookings(email) {
  return useQuery({
    queryKey: ['portal', 'bookings', email],
    queryFn: () => handle(api.fetchMyBookings(email)),
    enabled: Boolean(email),
  });
}

export function useMyTasks(clientId) {
  return useQuery({
    queryKey: ['portal', 'tasks', clientId],
    queryFn: () => handle(api.fetchMyTasks(clientId)),
    enabled: Boolean(clientId),
  });
}

export function useMyDocuments(clientId) {
  return useQuery({
    queryKey: ['portal', 'documents', clientId],
    queryFn: () => handle(api.fetchMyDocuments(clientId)),
    enabled: Boolean(clientId),
  });
}

// ─────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────
export function useDashboardKpis() {
  return useQuery({
    queryKey: ['dashboard', 'kpis'],
    queryFn: () => handle(api.fetchDashboardKpis()),
    staleTime: 1000 * 30,
  });
}
