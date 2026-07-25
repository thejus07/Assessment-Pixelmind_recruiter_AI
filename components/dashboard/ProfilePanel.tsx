"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { 
  User2, Briefcase, GraduationCap, Award, 
  Sparkles, Save, Edit3, Trash2, PlusCircle
} from 'lucide-react';

export const ProfilePanel: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  
  // Form states initialized with context user
  const [name, setName] = useState(user?.name || '');
  const [title, setTitle] = useState(user?.title || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [skillsInput, setSkillsInput] = useState(user?.skills.join(', ') || '');

  if (!user) return null;

  const handleSave = () => {
    const skills = skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    updateProfile({
      name,
      title,
      bio,
      skills
    });

    setIsEditing(false);
    toast("Profile Updated", "Changes synced to database storage.", "success");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Profile Header Details card */}
      <div className="p-5 rounded-2xl glass-panel bg-card/65 border border-border shadow relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img src={user.avatarUrl} alt={user.name} className="w-14 h-14 rounded-full border border-border shrink-0 object-cover" />
          <div>
            {isEditing ? (
              <div className="space-y-1">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-2 py-1 border border-border rounded-lg bg-background text-sm font-bold text-foreground focus:ring-1 focus:ring-indigo-500 outline-none"
                />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block px-2 py-0.5 border border-border rounded-md bg-background text-[11px] text-indigo-400 focus:ring-1 focus:ring-indigo-500 outline-none w-full"
                />
              </div>
            ) : (
              <>
                <h3 className="font-extrabold text-base tracking-tight">{user.name}</h3>
                <p className="text-xs text-indigo-400 font-semibold">{user.title}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{user.email}</p>
              </>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow transition-colors shrink-0"
        >
          {isEditing ? (
            <>
              Save Changes
              <Save className="h-4 w-4" />
            </>
          ) : (
            <>
              Edit Profile
              <Edit3 className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Bio & Skills */}
        <div className="md:col-span-1 space-y-6">
          
          {/* Bio card */}
          <div className="p-5 rounded-2xl glass-panel bg-card/65 border border-border shadow space-y-3">
            <h4 className="text-xs font-bold text-foreground">Biography</h4>
            {isEditing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full p-2.5 border border-border bg-background rounded-xl text-xs text-muted-foreground focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            ) : (
              <p className="text-xs text-muted-foreground leading-relaxed">{user.bio}</p>
            )}
          </div>

          {/* Skills card */}
          <div className="p-5 rounded-2xl glass-panel bg-card/65 border border-border shadow space-y-3">
            <h4 className="text-xs font-bold text-foreground">Skills Grid</h4>
            {isEditing ? (
              <textarea
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="Comma separated skills (e.g. React, Node)"
                rows={3}
                className="w-full p-2.5 border border-border bg-background rounded-xl text-xs text-muted-foreground focus:ring-1 focus:ring-indigo-500 outline-none font-mono"
              />
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {user.skills.map((s, idx) => (
                  <span key={idx} className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-background border border-border text-muted-foreground">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Work Experience, Projects, Education */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Work Experience */}
          <div className="p-5 rounded-2xl glass-panel bg-card/65 border border-border shadow space-y-4">
            <div className="flex items-center gap-1.5 text-indigo-400">
              <Briefcase className="h-4.5 w-4.5" />
              <h4 className="text-xs font-bold text-foreground">Professional Experience</h4>
            </div>

            <div className="space-y-4">
              {user.experience.map((exp, idx) => (
                <div key={idx} className="relative pl-4 border-l border-border/80 text-xs">
                  {/* Bullet orb */}
                  <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-indigo-500/25 border-2 border-indigo-500 rounded-full" />
                  
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-foreground">{exp.role}</span>
                    <span className="text-indigo-400 font-semibold">{exp.duration}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">{exp.company}</div>
                  <p className="text-muted-foreground leading-relaxed mt-2">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Projects */}
          <div className="p-5 rounded-2xl glass-panel bg-card/65 border border-border shadow space-y-4">
            <div className="flex items-center gap-1.5 text-indigo-400">
              <GraduationCap className="h-4.5 w-4.5" />
              <h4 className="text-xs font-bold text-foreground">Highlighted Work</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.projects.map((proj, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-border bg-background/50 space-y-2">
                  <div className="flex justify-between items-start">
                    <h5 className="text-xs font-bold text-foreground">{proj.title}</h5>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{proj.description}</p>
                  
                  <div className="flex flex-wrap gap-1 pt-1.5">
                    {proj.techStack.map((tech, i) => (
                      <span key={i} className="text-[8px] font-bold px-1.5 py-0.5 bg-indigo-500/5 text-indigo-400 border border-indigo-500/10 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePanel;
