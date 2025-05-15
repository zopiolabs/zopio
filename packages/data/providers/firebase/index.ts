/**
 * Firebase provider implementation
 */

import type { 
  CrudProvider, 
  GetListParams, 
  GetListResult,
  GetOneParams,
  GetOneResult,
  CreateParams,
  CreateResult,
  UpdateParams,
  UpdateResult,
  DeleteParams,
  DeleteResult
} from '@repo/data-base';

// Define a minimal Firestore interface with just the methods we need
interface FirestoreDocument {
  id: string;
  exists: boolean;
  data: () => Record<string, unknown>;
  get: () => Promise<FirestoreDocument>;
}

interface FirestoreQuery {
  where: (field: string, operator: string, value: unknown) => FirestoreQuery;
  orderBy: (field: string, direction?: 'asc' | 'desc') => FirestoreQuery;
  limit: (limit: number) => FirestoreQuery;
  startAfter: (doc: FirestoreDocument) => FirestoreQuery;
  get: () => Promise<FirestoreSnapshot>;
  // Add collection methods to query interface since they're used interchangeably
  collection: (path: string) => FirestoreCollectionRef;
  doc: (id: string) => FirestoreDocRef;
  add: (data: Record<string, unknown>) => Promise<FirestoreDocRef>;
}

interface FirestoreDocRef {
  get: () => Promise<FirestoreDocument>;
  set: (data: Record<string, unknown>) => Promise<void>;
  update: (data: Record<string, unknown>) => Promise<void>;
  delete: () => Promise<void>;
}

interface FirestoreCollectionRef {
  doc: (id: string) => FirestoreDocRef;
  add: (data: Record<string, unknown>) => Promise<FirestoreDocRef>;
  where: (field: string, operator: string, value: unknown) => FirestoreQuery;
  orderBy: (field: string, direction?: 'asc' | 'desc') => FirestoreQuery;
  limit: (limit: number) => FirestoreQuery;
  startAfter: (doc: FirestoreDocument) => FirestoreQuery;
  get: () => Promise<FirestoreSnapshot>;
}

interface FirestoreSnapshot {
  docs: FirestoreDocument[];
  size: number;
  empty: boolean;
}

interface Firestore {
  collection: (path: string) => FirestoreCollectionRef;
}

export interface FirebaseProviderConfig {
  firestore: Firestore; // Firestore instance
  collections?: Record<string, string>; // Map resource names to collection paths
}

/**
 * Create a Firebase provider
 */
export function createFirebaseProvider(config: FirebaseProviderConfig): CrudProvider {
  const { 
    firestore,
    collections = {}
  } = config;

  // Helper to get collection path from resource name
  const getCollectionPath = (resource: string): string => {
    return collections[resource] || resource;
  };

  return {
    async getList({ resource, pagination, sort, filter }: GetListParams): Promise<GetListResult> {
      try {
        const collectionPath = getCollectionPath(resource);
        let query = firestore.collection(collectionPath);
        
        // Apply filters
        if (filter) {
          for (const [field, value] of Object.entries(filter)) {
            if (value !== undefined && value !== null) {
              query = query.where(field, '==', value);
            }
          }
        }
        
        // Apply sorting
        if (sort) {
          query = query.orderBy(sort.field, sort.order === 'asc' ? 'asc' : 'desc');
        }
        
        // Get total count (this requires a separate query in Firestore)
        const countSnapshot = await query.get();
        const total = countSnapshot.size;
        
        // Apply pagination
        if (pagination) {
          const { page, perPage } = pagination;
          const offset = (page - 1) * perPage;
          query = query.limit(perPage);
          
          if (offset > 0) {
            // Firestore doesn't support direct offset, we need to use startAfter
            // This is a simplified approach - in a real implementation,
            // you would need to handle pagination tokens
            const paginationSnapshot = await firestore
              .collection(collectionPath)
              .orderBy(sort?.field || 'id')
              .limit(offset)
              .get();
            
            if (!paginationSnapshot.empty) {
              const lastDoc = paginationSnapshot.docs.at(-1);
              if (lastDoc) {
                query = query.startAfter(lastDoc);
              }
            }
          }
        }
        
        // Execute query
        const snapshot = await query.get();
        
        // Transform data
        const data = snapshot.docs.map((doc: { id: string; data: () => Record<string, unknown> }) => ({
          id: doc.id,
          ...doc.data()
        }));
        
        return { data, total };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async getOne({ resource, id }: GetOneParams): Promise<GetOneResult> {
      try {
        const collectionPath = getCollectionPath(resource);
        const docRef = firestore.collection(collectionPath).doc(String(id));
        const doc = await docRef.get();
        
        if (!doc.exists) {
          throw new Error(`Document ${id} not found in ${resource}`);
        }
        
        const data = {
          id: doc.id,
          ...doc.data()
        };
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async create({ resource, variables }: CreateParams): Promise<CreateResult> {
      try {
        const collectionPath = getCollectionPath(resource);
        const collectionRef = firestore.collection(collectionPath);
        
        // If id is provided in variables, use it as document id
        let docRef;
        const typedVariables = variables as Record<string, unknown>;
        if (typedVariables.id) {
          docRef = collectionRef.doc(String(typedVariables.id));
          await docRef.set(typedVariables);
        } else {
          // Let Firestore generate an id
          docRef = await collectionRef.add(variables as Record<string, unknown>);
        }
        
        const doc = await docRef.get();
        
        const data = {
          id: doc.id,
          ...doc.data()
        };
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async update({ resource, id, variables }: UpdateParams): Promise<UpdateResult> {
      try {
        const collectionPath = getCollectionPath(resource);
        const docRef = firestore.collection(collectionPath).doc(String(id));
        
        // Check if document exists
        const doc = await docRef.get();
        if (!doc.exists) {
          throw new Error(`Document ${id} not found in ${resource}`);
        }
        
        // Update document
        await docRef.update(variables);
        
        // Get updated document
        const updatedDoc = await docRef.get();
        
        const data = {
          id: updatedDoc.id,
          ...updatedDoc.data()
        };
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },

    async deleteOne({ resource, id }: DeleteParams): Promise<DeleteResult> {
      try {
        const collectionPath = getCollectionPath(resource);
        const docRef = firestore.collection(collectionPath).doc(String(id));
        
        // Get document before deleting
        const docSnapshot = await docRef.get();
        if (!docSnapshot.exists) {
          throw new Error(`Document ${id} not found in ${resource}`);
        }
        
        const data = {
          id: docSnapshot.id,
          ...docSnapshot.data()
        };
        
        // Delete document
        await docRef.delete();
        
        return { data };
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }
  };
}
