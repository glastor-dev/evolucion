import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  phone?: string;
  photoURL?: string;
  // Domicilio
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  // Facturación
  taxId?: string; // CUIT/RFC/NIF
  billingName?: string;
  billingAddress?: string;
  createdAt?: any;
  updatedAt?: any;
}

const collectionName = "users";

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const ref = doc(db, collectionName, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
};

export const upsertUserProfile = async (profile: UserProfile): Promise<void> => {
  const ref = doc(db, collectionName, profile.uid);
  // Quitar propiedades undefined (Firestore no admite undefined)
  const sanitized = Object.fromEntries(
    Object.entries(profile).filter(([_, v]) => v !== undefined)
  ) as Partial<UserProfile>;

  await setDoc(
    ref,
    {
      ...sanitized,
      updatedAt: serverTimestamp(),
      createdAt: (sanitized as any).createdAt || serverTimestamp(),
    },
    { merge: true }
  );
};
