import { Member, Village } from '../types';
import { pindraVillages } from '../data/pindraVillages';
import { membersData } from '../data';

// Deterministic mock name generator
const firstNames = ['राम', 'श्याम', 'विजय', 'संजय', 'कमलेश', 'राजेश', 'दिनेश', 'सुनीता', 'गीता', 'कमला', 'विमला', 'पुष्पा', 'मीना'];
const lastNames = ['सिंह', 'यादव', 'मौर्या', 'पटेल', 'मिश्रा', 'तिवारी', 'गौड़', 'प्रजापति', 'राजभर', 'चौरसिया'];

const getDeterministicPradhan = (village: Village): Member => {
  const seed = village.id;
  const firstName = firstNames[seed % firstNames.length];
  const lastName = lastNames[(seed * 7) % lastNames.length];

  return {
    id: 1000 + village.id,
    name: `${firstName}${seed % 3 === 0 ? ' देवी' : ' ' + lastName}`,
    role: 'ग्राम प्रधान (सरपंच)',
    phone: `9${(seed * 1234567).toString().substring(0, 9)}`,
    ward: 'सम्पूर्ण ग्राम',
    village: village,
    avatar: seed % 2 === 0 ? '👨‍💼' : '👩‍💼'
  };
};

export const memberService = {
  getMembersByVillage: async (village: Village | 'All'): Promise<Member[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));

    if (village === 'All') {
      return membersData;
    }

    // Get the constituency-level MLA (already in membersData as ID 0)
    const mla = membersData.find(m => m.id === 0);

    // Generate the specific Pradhan for this village
    const pradhan = getDeterministicPradhan(village);

    // Get other generic members that might belong to this village from mock data
    const otherMembers = membersData.filter(m =>
      m.id !== 0 && // Not MLA
      typeof m.village !== 'string' &&
      m.village.id === village.id
    );

    // Return MLA + Pradhan + Others
    const result = [];
    if (mla) result.push(mla);
    result.push(pradhan);

    // Add some mock ward members (panch) for better UI
    for (let i = 1; i <= 3; i++) {
        result.push({
            id: 2000 + village.id * 10 + i,
            name: `${firstNames[(village.id + i) % firstNames.length]} ${lastNames[(village.id * i) % lastNames.length]}`,
            role: `वार्ड सदस्य (वार्ड ${i})`,
            phone: `8${(village.id * 98765 + i).toString().substring(0, 9)}`,
            ward: `वार्ड ${i}`,
            village: village,
            avatar: (village.id + i) % 2 === 0 ? '👨' : '👩'
        });
    }

    return result;
  }
};
