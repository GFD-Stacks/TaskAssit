import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDocFromServer,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  BrandProfile,
  SocialTrend,
  CampaignBrief,
  ScheduledPost,
  DecisionRecord
} from '../types';

// Initialize Firebase App & Firestore with Database ID
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connectivity
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore connection warning: client appears offline.');
    }
    return false;
  }
}

// Firestore Collection Helpers

// 1. Brands
export async function fetchBrandsFromFirestore(): Promise<BrandProfile[]> {
  try {
    const snap = await getDocs(collection(db, 'brands'));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as BrandProfile));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'brands');
  }
}

export async function saveBrandToFirestore(brand: BrandProfile): Promise<void> {
  try {
    await setDoc(doc(db, 'brands', brand.id), {
      ...brand,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `brands/${brand.id}`);
  }
}

export async function deleteBrandFromFirestore(brandId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'brands', brandId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `brands/${brandId}`);
  }
}

// 2. Trends
export async function fetchTrendsFromFirestore(): Promise<SocialTrend[]> {
  try {
    const snap = await getDocs(collection(db, 'trends'));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SocialTrend));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'trends');
  }
}

export async function saveTrendToFirestore(trend: SocialTrend): Promise<void> {
  try {
    await setDoc(doc(db, 'trends', trend.id), {
      ...trend,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `trends/${trend.id}`);
  }
}

export async function deleteTrendFromFirestore(trendId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'trends', trendId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `trends/${trendId}`);
  }
}

// 3. Campaigns
export async function fetchCampaignsFromFirestore(): Promise<CampaignBrief[]> {
  try {
    const snap = await getDocs(collection(db, 'campaigns'));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CampaignBrief));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'campaigns');
  }
}

export async function saveCampaignToFirestore(campaign: CampaignBrief): Promise<void> {
  try {
    await setDoc(doc(db, 'campaigns', campaign.id), {
      ...campaign,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `campaigns/${campaign.id}`);
  }
}

export async function deleteCampaignFromFirestore(campaignId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'campaigns', campaignId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `campaigns/${campaignId}`);
  }
}

// 4. Scheduled Posts
export async function fetchScheduledPostsFromFirestore(): Promise<ScheduledPost[]> {
  try {
    const snap = await getDocs(collection(db, 'scheduledPosts'));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ScheduledPost));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'scheduledPosts');
  }
}

export async function saveScheduledPostToFirestore(post: ScheduledPost): Promise<void> {
  try {
    await setDoc(doc(db, 'scheduledPosts', post.id), {
      ...post,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `scheduledPosts/${post.id}`);
  }
}

export async function deleteScheduledPostFromFirestore(postId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'scheduledPosts', postId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `scheduledPosts/${postId}`);
  }
}

// 5. Decisions
export async function fetchDecisionsFromFirestore(): Promise<DecisionRecord[]> {
  try {
    const snap = await getDocs(collection(db, 'decisions'));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as DecisionRecord));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'decisions');
  }
}

export async function saveDecisionToFirestore(decision: DecisionRecord): Promise<void> {
  try {
    await setDoc(doc(db, 'decisions', decision.id), {
      ...decision,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `decisions/${decision.id}`);
  }
}

// 6. Performance Data
export async function fetchPerformanceDataFromFirestore(): Promise<any[]> {
  try {
    const snap = await getDocs(collection(db, 'performanceData'));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'performanceData');
  }
}

export async function savePerformanceDataToFirestore(data: any): Promise<void> {
  try {
    const id = data.id || `perf-${Date.now()}`;
    await setDoc(doc(db, 'performanceData', id), {
      ...data,
      id,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `performanceData/${data.id}`);
  }
}

// Real-Time Firestore Snapshot Subscriptions
export function subscribeToBrands(onUpdate: (brands: BrandProfile[]) => void, onError?: (err: any) => void) {
  return onSnapshot(
    collection(db, 'brands'),
    (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as BrandProfile));
      onUpdate(items);
    },
    (err) => {
      console.warn('Firestore brands subscription note:', err);
      if (onError) onError(err);
    }
  );
}

export function subscribeToTrends(onUpdate: (trends: SocialTrend[]) => void, onError?: (err: any) => void) {
  return onSnapshot(
    collection(db, 'trends'),
    (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as SocialTrend));
      onUpdate(items);
    },
    (err) => {
      console.warn('Firestore trends subscription note:', err);
      if (onError) onError(err);
    }
  );
}

export function subscribeToCampaigns(onUpdate: (campaigns: CampaignBrief[]) => void, onError?: (err: any) => void) {
  return onSnapshot(
    collection(db, 'campaigns'),
    (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as CampaignBrief));
      onUpdate(items);
    },
    (err) => {
      console.warn('Firestore campaigns subscription note:', err);
      if (onError) onError(err);
    }
  );
}

export function subscribeToScheduledPosts(onUpdate: (posts: ScheduledPost[]) => void, onError?: (err: any) => void) {
  return onSnapshot(
    collection(db, 'scheduledPosts'),
    (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ScheduledPost));
      onUpdate(items);
    },
    (err) => {
      console.warn('Firestore scheduledPosts subscription note:', err);
      if (onError) onError(err);
    }
  );
}

export function subscribeToDecisions(onUpdate: (decisions: DecisionRecord[]) => void, onError?: (err: any) => void) {
  return onSnapshot(
    collection(db, 'decisions'),
    (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as DecisionRecord));
      onUpdate(items);
    },
    (err) => {
      console.warn('Firestore decisions subscription note:', err);
      if (onError) onError(err);
    }
  );
}

export function subscribeToPerformanceData(onUpdate: (data: any[]) => void, onError?: (err: any) => void) {
  return onSnapshot(
    collection(db, 'performanceData'),
    (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      onUpdate(items);
    },
    (err) => {
      console.warn('Firestore performanceData subscription note:', err);
      if (onError) onError(err);
    }
  );
}

// Clean Slate Helper to Clear All Collections for Scenario Testing
export async function clearAllFirestoreCollections(): Promise<void> {
  const collectionNames = ['brands', 'trends', 'campaigns', 'scheduledPosts', 'decisions', 'performanceData'];
  for (const colName of collectionNames) {
    try {
      const snap = await getDocs(collection(db, colName));
      const deletePromises = snap.docs.map((d) => deleteDoc(d.ref));
      await Promise.all(deletePromises);
    } catch (err) {
      console.warn(`Clean slate deletion for ${colName} note:`, err);
    }
  }
}
