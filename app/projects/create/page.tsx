// app/projects/create/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToken } from '../../../lib/useToken';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import Select from '../../../components/Select';
import FileUpload from '../../../components/FileUpload';
import TagInput from '../../../components/TagInput';
import FormGroup from '../../../components/FormGroup';
import { Editor } from '@tinymce/tinymce-react';
import { User } from '../../../lib/prisma';
import { motion } from 'framer-motion';

const CreateProjectPage: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [repository, setRepository] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const token = useToken();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    };
    getUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = {
        name,
        description,
        repository,
        members: selectedMembers,
        files: selectedFiles,
        //tags: selectedTags,
      };

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/all-projects');
      } else {
        console.error('Error creating project:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }

    setIsSubmitting(false);
  };

  const fetchUsers = async (): Promise<User[]> => {
    try {
      const response = await fetch('/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const users: User[] = await response.json();
        return users;
      } else {
        console.error('Error fetching users:', response.statusText);
        return [];
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      const selectedFiles = Array.from(files);
      setSelectedFiles(selectedFiles);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <Card className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4 rounded-t-lg">
          <h1 className="text-2xl font-semibold text-white">Create Project</h1>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormGroup label="Project Name" htmlFor="name">
                <Input
                  name="name"
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full"
                />
              </FormGroup>
              <FormGroup label="Repository" htmlFor="repository">
                <Input
                  name="repository"
                  type="text"
                  id="repository"
                  value={repository}
                  onChange={(e) => setRepository(e.target.value)}
                  className="w-full"
                />
              </FormGroup>
            </div>
            <FormGroup label="Description" htmlFor="description" className="mt-6">
              <Editor
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                onEditorChange={(content) => setDescription(content)}
                init={{
                  height: 300,
                  menubar: false,
                  plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount',
                  ],
                  toolbar:
                    'undo redo | formatselect | bold italic backcolor | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | removeformat | help',
                }}
              />
            </FormGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <FormGroup label="Members" htmlFor="members">
                <Select
                  id="members"
                  options={users.map((user) => ({ value: user.id, label: user.username }))}
                  value={selectedMembers}
                  onChange={(memberIds) =>
                    setSelectedMembers(Array.isArray(memberIds) ? memberIds.map(String) : [])
                  }
                  isMulti
                />
              </FormGroup>
              <FormGroup label="Tags" htmlFor="tags">
                <TagInput
                  id="tags"
                  tags={selectedTags}
                  onChange={setSelectedTags}
                  placeholder="Add tags..."
                />
              </FormGroup>
            </div>
            <FormGroup label="Files" htmlFor="files" className="mt-6">
              <FileUpload
                id="files"
                onFileSelect={handleFileSelect}
                accept=".pdf,.doc,.docx,.txt,.md,.jpg,.jpeg,.png"
                multiple
              />
            </FormGroup>
            <div className="mt-8">
              <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </motion.div>
  );
};

export default CreateProjectPage;