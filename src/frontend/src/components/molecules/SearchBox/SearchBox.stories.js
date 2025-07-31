/**
 * SearchBox Component Stories
 * Storybook documentation for SearchBox molecule
 */

import { useState } from 'react';
import SearchBox from './SearchBox';

const mockSearchResults = [
  'React development',
  'JavaScript frameworks',
  'Design systems',
  'Component libraries',
  'Atomic design',
  'Storybook documentation',
  'User interface design',
  'Frontend development',
];

export default {
  title: 'Design System/Molecules/SearchBox',
  component: SearchBox,
  parameters: {
    docs: {
      description: {
        component: 'SearchBox molecule combines Input and Button atoms to create a complete search interface with clear functionality and loading states.',
      },
    },
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'SearchBox size (applies to both input and button)',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Loading state during search',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disabled state',
    },
    clearable: {
      control: { type: 'boolean' },
      description: 'Show clear button when there is text',
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: 'Full width search box',
    },
    autoFocus: {
      control: { type: 'boolean' },
      description: 'Auto focus the input on mount',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text',
    },
  },
};

// Default story
export const Default = {
  args: {
    placeholder: 'Search anything...',
    onSearch: (query) => console.log('Searching for:', query),
  },
};

// Size variants
export const Sizes = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
      <SearchBox 
        size="sm" 
        placeholder="Small search box"
        onSearch={(query) => console.log('Small search:', query)}
      />
      <SearchBox 
        size="md" 
        placeholder="Medium search box (default)"
        onSearch={(query) => console.log('Medium search:', query)}
      />
      <SearchBox 
        size="lg" 
        placeholder="Large search box"
        onSearch={(query) => console.log('Large search:', query)}
      />
    </div>
  ),
};

// States
export const States = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
      <SearchBox 
        placeholder="Normal state"
        onSearch={(query) => console.log('Normal search:', query)}
      />
      <SearchBox 
        placeholder="Loading state"
        loading
        onSearch={(query) => console.log('Loading search:', query)}
      />
      <SearchBox 
        placeholder="Disabled state"
        disabled
        onSearch={(query) => console.log('Disabled search:', query)}
      />
      <SearchBox 
        placeholder="Without clear button"
        clearable={false}
        onSearch={(query) => console.log('No clear search:', query)}
      />
    </div>
  ),
};

// Interactive example with search functionality
const InteractiveExample = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (query) => {
    setLoading(true);
    setSearchQuery(query);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const filteredResults = mockSearchResults.filter(item =>
      item.toLowerCase().includes(query.toLowerCase())
    );
    
    setResults(filteredResults);
    setLoading(false);
  };

  const handleClear = () => {
    setResults([]);
    setSearchQuery('');
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <SearchBox
        placeholder="Search for development topics..."
        onSearch={handleSearch}
        onClear={handleClear}
        loading={loading}
        fullWidth
      />
      
      {searchQuery && (
        <div style={{ marginTop: '1rem' }}>
          <h4 style={{ marginBottom: '0.5rem', color: '#666' }}>
            {loading ? 'Searching...' : `Results for "${searchQuery}" (${results.length})`}
          </h4>
          
          {!loading && results.length > 0 && (
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: 0,
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              backgroundColor: '#fff'
            }}>
              {results.map((result, index) => (
                <li key={index} style={{
                  padding: '0.75rem 1rem',
                  borderBottom: index < results.length - 1 ? '1px solid #f0f0f0' : 'none',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#f8f9fa'
                  }
                }}>
                  {result}
                </li>
              ))}
            </ul>
          )}
          
          {!loading && results.length === 0 && (
            <p style={{ color: '#666', fontStyle: 'italic' }}>
              No results found for "{searchQuery}"
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export const Interactive = {
  render: InteractiveExample,
  parameters: {
    docs: {
      description: {
        story: 'Interactive search box with simulated API calls, loading states, and result display.',
      },
    },
  },
};

// Full width example
export const FullWidth = {
  render: () => (
    <div style={{ width: '100%', padding: '1rem', backgroundColor: '#f8f9fa' }}>
      <SearchBox
        placeholder="Full width search across the entire container"
        fullWidth
        size="lg"
        onSearch={(query) => console.log('Full width search:', query)}
      />
    </div>
  ),
};

// Search with auto-focus
export const AutoFocus = {
  args: {
    placeholder: 'This input will be focused automatically',
    autoFocus: true,
    onSearch: (query) => console.log('Auto-focus search:', query),
  },
  parameters: {
    docs: {
      description: {
        story: 'SearchBox with auto-focus enabled - useful for search pages or modals.',
      },
    },
  },
};

// Search in different contexts
export const SearchContexts = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '0.5rem' }}>Global Search</h3>
        <SearchBox 
          placeholder="Search everything..."
          size="lg"
          fullWidth
          onSearch={(query) => console.log('Global search:', query)}
        />
      </div>
      
      <div>
        <h3 style={{ marginBottom: '0.5rem' }}>Product Search</h3>
        <SearchBox 
          placeholder="Search products..."
          onSearch={(query) => console.log('Product search:', query)}
        />
      </div>
      
      <div>
        <h3 style={{ marginBottom: '0.5rem' }}>Quick Filter</h3>
        <SearchBox 
          placeholder="Filter items..."
          size="sm"
          clearable={false}
          onSearch={(query) => console.log('Filter:', query)}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'SearchBox in different contexts - global search, product search, and filtering.',
      },
    },
  },
};