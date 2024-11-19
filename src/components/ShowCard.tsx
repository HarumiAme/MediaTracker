import React, { useState } from 'react';
import { TrackedShow } from '../types/show';
import { Play, CheckCircle2, MoreVertical, Trash2, Check, X } from 'lucide-react';
import { useShowStore } from '../store/useShowStore';
import { ConfirmationModal } from './ConfirmationModal';

interface ShowCardProps {
  show: TrackedShow;
  onClick: () => void;
}

export function ShowCard({ show, onClick }: ShowCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMarkWatchedModal, setShowMarkWatchedModal] = useState(false);
  const [showMarkUnwatchedModal, setShowMarkUnwatchedModal] = useState(false);
  const { deleteShow, markAllEpisodesWatched } = useShowStore();
  const watchedEpisodes = show.episodes.filter((ep) => ep.watched).length;
  const progress = (watchedEpisodes / show.episodes.length) * 100;

  const handleDelete = async () => {
    await deleteShow(show.id);
    setShowMenu(false);
  };

  const handleMarkAllWatched = async () => {
    await markAllEpisodesWatched(show.id);
    setShowMenu(false);
  };

  const handleMarkAllUnwatched = async () => {
    await markAllEpisodesWatched(show.id, undefined, false);
    setShowMenu(false);
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const openDeleteModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    setShowDeleteModal(true);
  };

  const openMarkWatchedModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    setShowMarkWatchedModal(true);
  };

  const openMarkUnwatchedModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    setShowMarkUnwatchedModal(true);
  };

  return (
    <>
      <div
        onClick={onClick}
        className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer border border-gray-700 group relative"
      >
        <div className="relative h-48">
          <img
            src={show.image.medium}
            alt={show.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent" />
          <button
            onClick={toggleMenu}
            className="absolute top-2 right-2 p-2 bg-gray-900/50 hover:bg-gray-900/70 rounded-full text-gray-300 hover:text-gray-100 transition-colors backdrop-blur-sm"
          >
            <MoreVertical size={16} />
          </button>
          {showMenu && (
            <div className="absolute top-12 right-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-1 z-10">
              <button
                onClick={openMarkWatchedModal}
                className="w-full px-4 py-2 text-left text-emerald-400 hover:bg-gray-700 flex items-center gap-2 text-sm"
              >
                <Check size={16} />
                Mark All as Watched
              </button>
              <button
                onClick={openMarkUnwatchedModal}
                className="w-full px-4 py-2 text-left text-gray-400 hover:bg-gray-700 flex items-center gap-2 text-sm"
              >
                <X size={16} />
                Mark All as Unwatched
              </button>
              <button
                onClick={openDeleteModal}
                className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 flex items-center gap-2 text-sm border-t border-gray-700"
              >
                <Trash2 size={16} />
                Delete Show
              </button>
            </div>
          )}
          <div className="absolute bottom-0 p-4 text-gray-100">
            <h3 className="text-xl font-bold">{show.name}</h3>
            <div className="flex items-center gap-2 mt-2 text-gray-300">
              <Play size={16} />
              <span className="text-sm">
                Season {show.currentSeason}
              </span>
              <CheckCircle2 size={16} className="ml-2" />
              <span className="text-sm">
                {watchedEpisodes}/{show.episodes.length} episodes
              </span>
            </div>
          </div>
        </div>
        <div className="w-full bg-gray-700 h-1">
          <div
            className="bg-emerald-500 h-1 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Show"
        message={`Are you sure you want to delete "${show.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isDangerous
      />

      <ConfirmationModal
        isOpen={showMarkWatchedModal}
        onClose={() => setShowMarkWatchedModal(false)}
        onConfirm={handleMarkAllWatched}
        title="Mark All Episodes as Watched"
        message={`Are you sure you want to mark all episodes of "${show.name}" as watched?`}
        confirmText="Mark All as Watched"
      />

      <ConfirmationModal
        isOpen={showMarkUnwatchedModal}
        onClose={() => setShowMarkUnwatchedModal(false)}
        onConfirm={handleMarkAllUnwatched}
        title="Mark All Episodes as Unwatched"
        message={`Are you sure you want to mark all episodes of "${show.name}" as unwatched?`}
        confirmText="Mark All as Unwatched"
      />
    </>
  );
}