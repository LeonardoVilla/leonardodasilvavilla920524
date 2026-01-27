// Validações
export const validation = {
  // Valida CPF (básico)
  isValidCPF(cpf: string | number): boolean {
    const cleanCpf = String(cpf).replace(/\D/g, "");
    if (cleanCpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleanCpf)) return false;
    return true;
  },

  // Valida email
  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  // Valida telefone (básico - apenas números)
  isValidPhone(phone: string): boolean {
    const cleanPhone = phone.replace(/\D/g, "");
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
  },

  // Valida nome (mínimo 3 caracteres)
  isValidName(name: string): boolean {
    return name.trim().length >= 3;
  },

  // Valida idade
  isValidAge(age: number): boolean {
    return age > 0 && age <= 50;
  },
};

// Máscaras
export const masks = {
  // Máscara CPF: 000.000.000-00
  cpf(value: string): string {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{2})$/, "$1-$2");
  },

  // Máscara Telefone: (00) 90000-0000 ou (00) 0000-0000
  phone(value: string): string {
    const cleanPhone = value.replace(/\D/g, "");
    if (cleanPhone.length <= 10) {
      return cleanPhone
        .slice(0, 10)
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }
    return cleanPhone
      .slice(0, 11)
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  },

  // Remove máscara
  unmask(value: string): string {
    return value.replace(/\D/g, "");
  },
};
