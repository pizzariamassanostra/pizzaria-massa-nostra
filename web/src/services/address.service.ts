import api from "./api.service";

export interface Address {
  id: number;
  common_user_id: number;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  reference: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAddressDto {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  reference?: string;
  is_default?: boolean;
}

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

class AddressService {
  async create(
    data: CreateAddressDto
  ): Promise<{ ok: boolean; message: string; address: Address }> {
    const response = await api.post("/order/address", data);
    return response.data;
  }

  async getMyAddresses(): Promise<{ ok: boolean; addresses: Address[] }> {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      throw new Error("Usuário não autenticado");
    }

    const user = JSON.parse(userStr);
    const response = await api.get(`/order/address/user/${user.id}`);
    return response.data;
  }

  async update(
    id: number,
    data: CreateAddressDto
  ): Promise<{ ok: boolean; message: string; address: Address }> {
    const response = await api.put(`/order/address/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<{ ok: boolean; message: string }> {
    const response = await api.delete(`/order/address/${id}`);
    return response.data;
  }

  async searchCep(cep: string): Promise<ViaCepResponse> {
    const cleanCep = cep.replaceAll(/\D/g, "");

    if (cleanCep.length !== 8) {
      throw new Error("CEP inválido");
    }

    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();

    if (data.erro) {
      throw new Error("CEP não encontrado");
    }

    return data;
  }
}

export const addressService = new AddressService();
