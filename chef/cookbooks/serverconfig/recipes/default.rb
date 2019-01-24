apt_update 'update apt daily' do
	frequency 	86400
	action		:periodic
end

execute 'git config --global user.name "Jagrajan Bhullar"'
execute 'git config --global user.email jag@jagrajan.com'

directory 'vundle directory' do
	path 		'/home/jag/.vim/bundle/Vundle.vim'
	recursive	true
	action		:create
end

git "/home/jag/.vim/bundle/Vundle.vim" do
  	repository "git://github.com/VundleVim/Vundle.vim.git"
  	action :sync
end

cookbook_file "vimrc" do
  path "/home/jag/.vimrc"
end

execute 'vim +PluginInstall +qall'

include_recipe "nodejs::nodejs_from_binary"

package 'nginx'
cookbook_file 'nginx-default' do
  path '/etc/nginx/sites-available/default'
end
execute 'nginx -s reload'

