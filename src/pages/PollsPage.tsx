import React, { useState, useCallback, useMemo } from 'react';
import { pollsData } from '../data';
import { colors } from '../utils/colors';
import { Village } from '../types';

interface PollsPageProps {
  selectedVillage: Village | 'All';
}

export const PollsPage = React.memo(function PollsPage({ selectedVillage }: PollsPageProps) {
  const [localPolls, setLocalPolls] = useState(pollsData);

  const filteredPolls = useMemo(() => {
    return localPolls.filter(poll =>
      selectedVillage === 'All' || poll.village === selectedVillage || poll.village === 'All'
    );
  }, [localPolls, selectedVillage]);

  const handleVote = useCallback(
    (pollId: number, optionId: number) => {
      setLocalPolls((prev) =>
        prev.map((poll) =>
          poll.id === pollId
            ? {
                ...poll,
                options: poll.options.map((option) =>
                  option.id === optionId
                    ? { ...option, votes: option.votes + 1, voted: true }
                    : option
                ),
              }
            : poll
        )
      );
    },
    []
  );

  const getTotalVotes = (pollId: number) => {
    const poll = localPolls.find((p) => p.id === pollId);
    return poll ? poll.options.reduce((sum, opt) => sum + opt.votes, 0) : 0;
  };

  const getPercentage = (votes: number, total: number) => {
    return total === 0 ? 0 : Math.round((votes / total) * 100);
  };

  return (
    <div style={{ paddingBottom: '80px' }} className="page-transition">
      {/* Polls List */}
      <div style={{ padding: '16px' }}>
        {filteredPolls.map((poll) => {
          const totalVotes = getTotalVotes(poll.id);

          return (
            <div
              key={poll.id}
              style={{
                marginBottom: '20px',
                backgroundColor: colors.neutral.white,
                border: `1px solid ${colors.border}`,
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              {/* Poll Header */}
              <div style={{ padding: '16px', backgroundColor: colors.primary.light }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>
                  {poll.title}
                </h3>
                <p style={{ margin: '0', fontSize: '13px', color: colors.text.secondary }}>
                  {poll.date}
                </p>
              </div>

              {/* Poll Content */}
              <div style={{ padding: '16px' }}>
                <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: colors.text.primary }}>
                  {poll.question}
                </p>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {poll.options.map((option) => {
                    const percentage = getPercentage(option.votes, totalVotes);

                    return (
                      <button
                        key={option.id}
                        onClick={() => handleVote(poll.id, option.id)}
                        style={{
                          position: 'relative',
                          padding: '12px',
                          backgroundColor: colors.neutral.white,
                          border: `1px solid ${colors.border}`,
                          borderRadius: '8px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          overflow: 'hidden',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.borderColor = colors.primary.main;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.borderColor = colors.border;
                        }}
                      >
                        {/* Background Progress Bar */}
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            height: '100%',
                            width: `${percentage}%`,
                            backgroundColor: colors.primary.light,
                            transition: 'width 0.3s ease',
                            zIndex: 0,
                          }}
                        />

                        {/* Content */}
                        <div style={{ position: 'relative', zIndex: 1 }}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <span style={{ fontSize: '14px', fontWeight: '500' }}>
                              {option.text}
                            </span>
                            <div style={{ textAlign: 'right', fontSize: '13px', fontWeight: '600' }}>
                              <div style={{ color: colors.primary.dark }}>
                                {percentage}% ({option.votes})
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Total Votes */}
                <div
                  style={{
                    marginTop: '16px',
                    padding: '8px 12px',
                    backgroundColor: colors.neutral.light,
                    borderRadius: '6px',
                    textAlign: 'center',
                    fontSize: '13px',
                    color: colors.text.secondary,
                  }}
                >
                  कुल मतदान: {totalVotes}
                </div>

                {/* Status Badge */}
                <div
                  style={{
                    marginTop: '12px',
                    padding: '8px 12px',
                    backgroundColor: poll.status === 'active' ? colors.status.success : colors.status.error,
                    color: colors.neutral.white,
                    borderRadius: '6px',
                    textAlign: 'center',
                    fontSize: '13px',
                    fontWeight: '600',
                  }}
                >
                  {poll.status === 'active' ? '🟢 सक्रिय' : '🔴 बंद'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
