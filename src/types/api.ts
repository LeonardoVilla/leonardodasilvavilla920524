export interface Pet {
  id: string;
  nome: string;
  idade: number;
}

const [pets, setPets] = useState<Pet[]>([]);