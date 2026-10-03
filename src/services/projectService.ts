import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase.ts';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors.ts';
import { CreateProjectInput, Project, UpdateProjectInput } from '../types/project.ts';

const COLLECTION_NAME = 'projects';

export async function createProject(input: CreateProjectInput): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User must be authenticated to create a project');
  }

  const projectRef = doc(collection(db, COLLECTION_NAME));
  const newProjectData: Record<string, unknown> = {
    userId: user.uid,
    name: input.name.trim(),
    status: input.status || 'planning',
    priority: input.priority || 'medium',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (input.description !== undefined && input.description.trim() !== '') {
    newProjectData.description = input.description.trim();
  }

  try {
    await setDoc(projectRef, newProjectData);
    return projectRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${COLLECTION_NAME}/${projectRef.id}`);
  }
}

export async function updateProject(projectId: string, input: UpdateProjectInput): Promise<void> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User must be authenticated to update a project');
  }

  const projectRef = doc(db, COLLECTION_NAME, projectId);
  const updateData: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };

  if (input.name !== undefined) {
    updateData.name = input.name.trim();
  }
  if (input.description !== undefined) {
    updateData.description = input.description.trim();
  }
  if (input.status !== undefined) {
    updateData.status = input.status;
  }
  if (input.priority !== undefined) {
    updateData.priority = input.priority;
  }

  try {
    await updateDoc(projectRef, updateData);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${projectId}`);
  }
}

export async function deleteProject(projectId: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User must be authenticated to delete a project');
  }

  const projectRef = doc(db, COLLECTION_NAME, projectId);
  try {
    await deleteDoc(projectRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${projectId}`);
  }
}

export function subscribeUserProjects(
  userId: string,
  onProjectsUpdated: (projects: Project[]) => void,
  onError?: (err: Error) => void
): () => void {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const projects: Project[] = [];
      snapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        projects.push({
          id: docSnapshot.id,
          userId: data.userId,
          name: data.name,
          description: data.description || '',
          status: data.status || 'planning',
          priority: data.priority || 'medium',
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      });
      onProjectsUpdated(projects);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
      } catch (err) {
        if (onError && err instanceof Error) {
          onError(err);
        }
      }
    }
  );
}
